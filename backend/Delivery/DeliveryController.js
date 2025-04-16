const pool = require('../Database Pool/DBConnections');

setInterval(deployRobots, 10 * 60 * 1000);

const logger = require('../Utils/Logger'); 

const deployRobots = async () => {

    logger.info("Deploying Robots...")

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

            logger.info("Getting Robots That Are Free")

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

            // Step 1: Assign deliveries to robots
            const robotAddresses = Array.from({ length: freeRobots.length }, () => []);

            let j = 0;

            for (let i = 0; i < freeRobots.length && j < pendingDelivery.length; i++) {

                let weight = 0;

                while (robotAddresses[i].length <= 10 && j < pendingDelivery.length) {

                    const delivery = pendingDelivery[j];

                    if (weight + delivery.TransactionWeight > 200) break;

                    robotAddresses[i].push(delivery);

                    weight += delivery.TransactionWeight;

                    j++;

                }

            }

            logger.info("Assigned Robots Addresses: " + robotAddresses)


            logger.info("Turning The Addresses To Geocodes")
            // Step 2: Geocode each robot's delivery addresses
            const geocodedAddresses = [];

            for (let i = 0; i < robotAddresses.length; i++) {

                const geo = [];

                for (let m = 0; m < robotAddresses[i].length; m++) {

                    const coords = await geocodeAddress(robotAddresses[i][m].DeliveryAddress);

                    geo.push(coords);

                }

                geocodedAddresses.push(geo);

            }

            logger.info("Geocodes Found: " + geocodedAddresses)

            logger.info("Deploying Robots")

            // Step 3: Deploy each robot with optimized route
            for (let i = 0; i < geocodedAddresses.length; i++) {

                logger.info("Deploying Robot: " + freeRobots[i].RobotID)

                const optimized = await getOptimizedRoute(geocodedAddresses[i]);

                const tripDurationMs = optimized.optimizedRoute.duration * 1000;


                setTimeout(async () => {

                    const robotDeliveries = robotAddresses[i];

                    const transactionIDs = robotDeliveries.map(row => row.TransactionID);

                    let dbConn;

                    try {

                        dbConn = await pool.promise().getConnection();

                        await dbConn.beginTransaction();

                            await dbConn.query(

                                'UPDATE Robot SET RobotStatus = "Complete" WHERE RobotID = ?',

                                [freeRobots[i].RobotID]

                            );

                            await dbConn.query(

                                'UPDATE transactions SET TransactionStatus = "Complete", TransactionTime = NULL WHERE TransactionID IN (?)',

                                [transactionIDs]

                            );

                        await dbConn.commit();

                        dbConn.release();

                        logger.info("Successful Delivery On Robot: " + freeRobots[i].RobotID)

                    } catch (error) {

                        
                        logger.error("Error While Delivering: " + error.message)

                        if (dbConn) {
                
                            try {
                
                                logger.info("Rolling Back Connection");
                
                                await dbConn.rollback();
                
                            } catch (rollbackError) {
                
                                logger.error("Error During Rollback: " + rollbackError.message);
                
                            }
                        
                            try {
                
                                logger.info("Releasing Connection");
                
                                dbConn.release();
                
                            } catch (releaseError) {
                
                                logger.error("Error Releasing Connection: " + releaseError.message);
                
                            }
                            
                        }

                    } 

                }, tripDurationMs);

            }

        await connection.commit();

        connection.release();

    } catch (error) {


        logger.error("Deployment Error: " + error.message)

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

    logger.info("Getting Optimized Route")

    const accessToken = process.env.MAPBOXSECRET;

    const coordsStr = geoCodes.map(coord => coord.join(',')).join(';');

    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordsStr}?access_token=${accessToken}&geometries=geojson&overview=full&roundtrip=true`;
   
    const response = await fetch(url);

    const data = await response.json();

    if (!data.trips || data.trips.length === 0) {

        throw new Error("Failed to optimize route")

    }

    const trip = data.trips[0];

    const waypointOrder = data.waypoints.map(wp => wp.waypoint_index);

    logger.info("Optimized Route Found");
    
    return {

        optimizedRoute: trip,

        waypointOrder,

    };

};

module.exports = { deployRobots };
