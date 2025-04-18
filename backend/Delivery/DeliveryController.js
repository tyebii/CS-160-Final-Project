
const pool = require('../Database Pool/DBConnections');

const { statusCode } = require('../Utils/Formatting');

const {logger} = require('../Utils/Logger'); 

const scheduleRobots = async (req, res) => {

    logger.info("Scheduling Robots...")

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

            logger.info("Getting Rid Of Previous Scheduling")

            await connection.query("Update Transactions Set Transactions.RobotID = NULL Where Transactions.RobotID Is Not Null And TransactionStatus = 'Pending Delivery'")

            logger.info("Getting Robots That Are Free")
            
            const [freeRobots] = await connection.query(

                'SELECT * FROM Robot WHERE RobotStatus = "Free"'

            );

            if (!freeRobots || freeRobots.length === 0) {

                logger.error("No Free Robots Found")

                throw new Error("No Free Robots");

            }

            logger.info("Getting Transactions That Are Pending Delivery")

            const [pendingDelivery] = await connection.query(

                `SELECT transactions.TransactionWeight, transactions.TransactionDate, transactions.TransactionID, 
                
                address.address AS DeliveryAddress 

                FROM transactions 

                JOIN address ON transactions.TransactionAddress = address.address 

                WHERE TransactionStatus = "Pending Delivery" 

                ORDER BY TransactionDate DESC`

            );

            if (!pendingDelivery || pendingDelivery.length === 0) {

                logger.error("No Transactions Pending Delivery")

                throw new Error("No Transactions To Deliver");
                
            }

            logger.info("Assigning Addresses To Robots And Updating Transactions")


            logger.info("Assigining Deliveries To Robots")

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

                logger.info("Updating Transactions With Robot ID: " + freeRobots[i].RobotID)

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

        logger.info("Assigned Robots Addresses And Updated Database With " + robotAddresses)

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

const deployRobots = async (req, res) => {

    logger.info("Deploying Robots...");

    let connection;

    try {

        connection = await pool.promise().getConnection();

        logger.info("Pulling Mapbox Secret")

        logger.silly("PLEASE DO NOT RUN THE API TOO MUCH. I'M Broke")

        if (!process.env.MAPBOXSECRET) {

            logger.error("Mapbox Secret Could Not Be Fetched")

            throw new Error("MAPBOXSECRET environment variable not set");

        }

        logger.info("Fetching Transactions Assigned to Robots");

        const [transactions] = await connection.query(

            "SELECT * FROM Transactions WHERE TransactionStatus = 'Pending Delivery' AND RobotID IS NOT NULL ORDER BY RobotID"

        );

        if (transactions.length === 0) {

            logger.error("There Are No Robot To Deploy")

            throw new Error("There Are No Robots To Deploy");

        }

        logger.info("Populating Robot-Address Map")

        const robotMap = {};

        for (const transaction of transactions) {

            const { RobotID } = transaction;

            if (!robotMap[RobotID]) robotMap[RobotID] = [];

            robotMap[RobotID].push(transaction);

        }

        logger.info("Turning Robot-Addresses into Geocodes");

        for (const robotID in robotMap) {

            for (let i = 0; i < robotMap[robotID].length; i++) {

                const coords = await geocodeAddress(robotMap[robotID][i].TransactionAddress);

                robotMap[robotID][i].TransactionAddress = coords;

            }

        }

        logger.info("Geocodes Found. Deploying Robots...");

        const failedRobots = [];

        for (const robotID in robotMap) {

            logger.info(`Deploying Robot: ${robotID}`);

            try {

                await connection.beginTransaction();

                    const destinationCoords = robotMap[robotID].map(row => row.TransactionAddress);

                    const routeCoords = [[-121.8839, 37.3385], ...destinationCoords]; 

                    logger.info("Getting Optimized Routes")

                    const optimized = await getOptimizedRoute(routeCoords);

                    const tripDurationMs = optimized.optimizedRoute.duration * 1000;

                    const transactionIDs = robotMap[robotID].map(t => t.TransactionID);

                    logger.info(`Updating Robot ${robotID} Status to 'En Route'`);

                    await connection.query(

                        "UPDATE Robot SET RobotStatus = 'En Route' WHERE RobotID = ?",

                        [robotID]

                    );

                    logger.info(`Updating Transactions for Robot ${robotID} to 'Delivering And Setting The Expected Time'`);

                    let accumulatedDuration = 0;

                    const now = new Date();

                    const legs = optimized.optimizedRoute.legs;

                    for (let leg = 0; leg < legs.length; leg++) {

                        accumulatedDuration += legs[leg].duration;

                        const deliveryTime = new Date(now.getTime() + accumulatedDuration * 1000);

                        await connection.query(

                            "UPDATE Transactions SET TransactionStatus = 'Delivering', TransactionTime = ? WHERE TransactionID = ?",

                            [deliveryTime, transactionIDs[leg]]

                        );

                    }

                await connection.commit();

                logger.info(`Robot ${robotID} Dispatched. Sleeping For ${tripDurationMs} ms.`);

                setTimeout(async () => {

                    logger.info(`Waking Robot ${robotID} to mark as Free.`);

                    let connectionAsync; 

                    try{

                        connectionAsync = await pool.promise().getConnection()

                        await connectionAsync.beginTransaction()

                            logger.info("Updating The Robot Status To Free")

                            await connectionAsync.query('UPDATE Robot SET RobotStatus = "Free" WHERE RobotID = ?', [robotID])

                            logger.info(`Robot ${robotID} is now Free.`);
        
                            const placeholders = transactionIDs.map(() => '?').join(', ');

                            logger.info("Updating The Robot's Transactions To Fullfilled")

                            await connectionAsync.query(

                              `UPDATE Transactions SET TransactionStatus = "Fulfilled" WHERE TransactionID IN (${placeholders})`,
                              
                              transactionIDs

                            );       

                        await connectionAsync.commit()

                        connectionAsync.release()

                        logger.info("Robot Handled Successfully")

                    }catch(error){

                        logger.error(`Error Updating Robot ${robotID} And Transactions: ${error.message}`);

                        if (connectionAsync) {
        
                            try {
        
                                await connectionAsync.rollback();

                                connectionAsync.release();
        
                            } catch (err) {
        
                                logger.error(`Error During Rollback: ${err.message}`);
        
                            }
        
                        }

                    }

                }, tripDurationMs);

            } catch (error) {

                logger.error(`Error Deploying Robot ${robotID}: ${error.message}`);

                failedRobots.push(robotID);

                if (connection) {

                    try {

                        await connection.rollback();

                    } catch (err) {

                        logger.error(`Error During Rollback: ${err.message}`);

                    }

                }

            }

        }

        connection.release();

        logger.info("Failed Robots: " + failedRobots)

    } catch (error) {

        logger.error("Deployment Error: " + error.message);

        logger.error("Failed Robots: " + failedRobots)

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
