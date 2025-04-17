
const pool = require('../Database Pool/DBConnections');

const { statusCode } = require('../Utils/Formatting');

const logger = require('../Utils/Logger'); 

const scheduleRobots = async (req, res) => {

    logger.info("Scheduling Robots...")

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

            logger.info("Getting Robots That Are Free")

            await connection.query("Update Transactions Set Transactions.RobotID = NULL Where Transactions.RobotID Is Not Null")

            const [freeRobots] = await connection.query(

                'SELECT * FROM Robot WHERE RobotStatus = "Free"'

            );

            if (!freeRobots || freeRobots.length === 0) {

                throw new Error("No Free Robots");

            }

            logger.info("Getting Transactions That Are Out For Delivery")

            const [pendingDelivery] = await connection.query(

                `SELECT transactions.TransactionWeight, transactions.TransactionDate, transactions.TransactionID, 
                
                address.address AS DeliveryAddress 

                FROM transactions 

                JOIN address ON transactions.TransactionAddress = address.address 

                WHERE TransactionStatus = "Out For Delivery" 

                ORDER BY TransactionDate DESC`

            );

            if (!pendingDelivery || pendingDelivery.length === 0) {

                throw new Error("No Transactions To Deliver");
                
            }

            logger.info("Assigning Addresses To Robots And Updating Transactions")


            // Step 1: Assign deliveries to robots
            const robotAddresses = Array.from({ length: freeRobots.length }, () => []);

            let j = 0;

            for (let i = 0; i < freeRobots.length && j < pendingDelivery.length; i++) {

                let weight = 0;

                const transactionIDList = []

                while (robotAddresses[i].length <= 10 && j < pendingDelivery.length) {

                    const delivery = pendingDelivery[j];

                    if (weight + delivery.TransactionWeight > 200) break;

                    robotAddresses[i].push(delivery);

                    transactionIDList.push(delivery.TransactionID)

                    weight += delivery.TransactionWeight;

                    j++;

                }

                logger.info("Updating Transactions: ")

                if (transactionIDList.length > 0) {

                    const placeholders = transactionIDList.map(() => '?').join(', '); // => "?, ?"
                
                    await connection.query(

                        `UPDATE Transactions SET RobotID = ? WHERE TransactionID IN (${placeholders})`,

                        [freeRobots[i].RobotID, ...transactionIDList]

                    );

                }

            }

        await connection.commit();

        connection.release();

        logger.info("Assigned Robots Addresses And Updated Database: " + robotAddresses)

        return res.sendStatus(statusCode.OK)

    } catch (error) {

        logger.error("Scheduling Error: " + error.message)

        if (connection) {

            try {

                logger.info("Rolling Back Connection");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Error During Rollback: " + rollbackError.message);

            }
        
            try {

                logger.info("Releasing Connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Error Releasing Connection: " + releaseError.message);

            }
            
        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Error While Scheduling Robots"})

    }

};

const deployRobots = async () => {

    logger.info("Deploying Robots...")

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

        logger.info("Fetching The Address Of Each Robot");

        const [Transactions] = await connection.query(

            "SELECT * FROM Transactions WHERE TransactionStatus = 'Out For Delivery' AND RobotID IS NOT NULL ORDER BY RobotID"

        );

        if (Transactions.length === 0) {

            throw new Error("There Are No Robots To Deploy");

        }

        const robotMap = {};

        for (const transaction of Transactions) {

            const { RobotID } = transaction;

            if (!robotMap[RobotID]) robotMap[RobotID] = [];

            robotMap[RobotID].push(transaction);

        }

        logger.info("Turning The Addresses To Geocodes");

        for (const robotID in robotMap) {

            for (let i = 0; i < robotMap[robotID].length; i++) {

                const coords = await geocodeAddress(robotMap[robotID][i].TransactionAddress);

                robotMap[robotID][i].TransactionAddress = coords;

            }
        }

        logger.info("Geocodes Found");

        for (const robotID in robotMap) {

            logger.info("Deploying Robot: " + robotID);

            const destinationCoords = robotMap[robotID].map(row => row.TransactionAddress);

            const origin = [-121.8839, 37.3385]; 

            const routeCoords = [origin, ...destinationCoords];

            const optimized = await getOptimizedRoute(routeCoords);

            const tripDurationMs = optimized.optimizedRoute.duration * 1000;

            const transactionIDs = robotMap[robotID].map(t => t.TransactionID);

            logger.info("Update Robot To Deliverying")

            await connection.query("UPDATE Robot SET RobotStatus = \"En Route\" WHERE RobotID = ?", robotID)

            logger.info("Update Transaction Status")


            if (transactionIDs.length > 0) {

                const placeholders = transactionIDs.map(() => '?').join(', ');

                //console.log(transactionIDs)
            
                //await connection.query(

                   // `UPDATE Transactions SET TransactionStatus = "Delivering", TransactionTime = NULL WHERE TransactionID IN (${placeholders})`,

                   // [...transactionIDs]

                //);

            }

            logger.info("Going To Sleep For " + tripDurationMs + "ms for Robot: " + robotID);

            setTimeout(async () => {

                let dbConn;

                try {

                    dbConn = await pool.promise().getConnection();

                    await dbConn.beginTransaction();

                    await dbConn.query(

                        'UPDATE Robot SET RobotStatus = "Free" WHERE RobotID = ?',

                        [robotID]

                    );

                    await dbConn.query(
                        
                        'UPDATE Transactions SET TransactionStatus = "Fulfilled", TransactionTime Is NULL WHERE TransactionID IN (?)',
                        
                        [transactionIDs]

                    );

                    await dbConn.commit();

                    dbConn.release();

                    logger.info("Successful Delivery On Robot: " + robotID);

                } catch (error) {

                    logger.error("Error While Delivering: " + error.message);

                    if (dbConn) {

                        try {

                            await dbConn.rollback();

                            dbConn.release();

                        } catch (rollbackError) {

                            logger.error("Error During Rollback: " + rollbackError.message);

                        }

                    }

                }

            }, tripDurationMs);
        }

        await connection.commit();

        connection.release();

    } catch (error) {
        logger.error("Deployment Error: " + error.message);

        if (connection) {

            try {

                await connection.rollback();

                connection.release();

            } catch (err) {

                logger.error("Error During Rollback/Release: " + err.message);

            }

        }

    }

};


//Turn Address Into Geocode
const geocodeAddress = async (address) => {

    logger.info("Geocoding The Address")

    const encodedAddress = encodeURIComponent(address);

    const accessToken = process.env.MAPBOXSECRET;

    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`);
    
    const data = await response.json();

    if (data.features.length > 0) {

        logger.info("Geocoding Successful")

        return data.features[0].center;

    } else {

        throw new Error(`Could not geocode address: ${address}`);

    }

};

//Optimized Route Between Addresses
const getOptimizedRoute = async (geoCodes) => {

    logger.info("Getting Optimized Route");

    const accessToken = process.env.MAPBOXSECRET;

    const coordsStr = geoCodes.map(coord => coord.join(',')).join(';');

    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordsStr}?access_token=${accessToken}&geometries=geojson&overview=full&roundtrip=true`;

    logger.info("Request URL: " + url);

    let response;

    try {

        response = await fetch(url);

    } catch (err) {

        throw new Error("Failed to reach Mapbox API: " + err.message);

    }

    if (!response.ok) {

        throw new Error(`Mapbox API returned error: ${response.status} ${response.statusText}`);
    
    }

    let data;

    try {

        data = await response.json();

    } catch (err) {

        throw new Error("Failed to parse Mapbox response: " + err.message);

    }

    if (!data.trips || data.trips.length === 0) {

        throw new Error("Failed to optimize route");

    }

    const trip = data.trips[0];

    const waypointOrder = data.waypoints.map(wp => wp.waypoint_index);

    logger.info("Optimized Route Found");

    return {

        optimizedRoute: trip,

        waypointOrder,

    };

};


module.exports = { deployRobots, scheduleRobots };
