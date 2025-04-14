const pool = require('../Database Pool/DBConnections');

setInterval(deployRobots, 10 * 60 * 1000);

const deployRobots = async () => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        await connection.beginTransaction();

            const [freeRobots] = await connection.query(
                'SELECT * FROM Robot WHERE RobotStatus = "Free"'
            );

            if (!freeRobots || freeRobots.length === 0) {
                throw new Error("No Free Robots");
            }

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

        // Step 3: Deploy each robot with optimized route
        for (let i = 0; i < geocodedAddresses.length; i++) {
            const optimized = await getOptimizedRoute(geocodedAddresses[i]);
            const tripDurationMs = optimized.optimizedRoute.duration * 1000;

            // Simulate delivery completion
            setTimeout(async () => {
                const robotDeliveries = robotAddresses[i];
                const transactionIDs = robotDeliveries.map(row => row.TransactionID);

                const dbConn = await pool.promise().getConnection();
                try {
                    await dbConn.beginTransaction();

                    await dbConn.query(
                        'UPDATE Robot SET RobotStatus = ? WHERE RobotID = ?',
                        ["Complete", freeRobots[i].RobotID]
                    );

                    await dbConn.query(
                        'UPDATE transactions SET TransactionStatus = ? WHERE TransactionID IN (?)',
                        ["Complete", transactionIDs]
                    );

                    await dbConn.commit();
                } catch (error) {
                    await dbConn.rollback();
                    console.error("Error in setTimeout update:", error);
                } finally {
                    dbConn.release();
                }
            }, tripDurationMs);
        }

        await connection.commit();
    } catch (error) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        console.error("Deployment error:", error);
    } finally {
        if (connection) connection.release();
    }
};

const geocodeAddress = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const accessToken = process.env.MAPBOXSECRET;

    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`);
    const data = await response.json();

    if (data.features.length > 0) {
        return data.features[0].center;
    } else {
        throw new Error(`Could not geocode address: ${address}`);
    }
};

const getOptimizedRoute = async (geoCodes) => {
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

    return {
        optimizedRoute: trip,
        waypointOrder,
    };
};

module.exports = { deployRobots };
