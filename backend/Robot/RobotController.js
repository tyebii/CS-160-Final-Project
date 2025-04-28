const pool = require('../Database Pool/DBConnections')

const {validateRegularID, statusCode} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger'); 

//Get All Robots
const getRobot = (req,res) => {

    logger.info("Getting Robots....")

    const sqlQuery = "Select * From robot Where RobotStatus!='Retired' Order By RobotStatus Desc, RobotID Asc"

    pool.query(sqlQuery, (error, results)=>{

            if(error){

                logger.error("Error Fetching Robots: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Robots'});

            }

            logger.info("Successfully Fetched Robot")

            return res.status(statusCode.OK).json(results)

        }
    )
}

//Get All Faulty Robots
const getFaultyRobot = (req,res)=>{

    logger.info("Getting Faulty Robots")

    const sqlQuery = "Select * From FaultyRobots Order By RobotID Asc"

    pool.query(sqlQuery, (error, results)=>{

            if(error){

                logger.error("Error Fetching Faulty Robots: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Faulty Robots'});

            }

            logger.info("Successfully Fetched Faulty Robots")

            return res.status(statusCode.OK).json(results)

        }
    )
}

//Add Robot
const addRobot = (req, res) => {

    logger.info("Adding Robot")

    const {RobotID, CurrentLoad,RobotStatus, Maintanence} = req.body

    const sqlQuery = "Insert Into Robot(RobotID, CurrentLoad, RobotStatus, Maintanence) Values(?,?,?,?)"

    logger.info(Maintanence)
    
    pool.query(sqlQuery, [RobotID,CurrentLoad,RobotStatus,Maintanence], (error, results)=>{

        if(error){

            logger.error("Error Adding Robots: " + error.message)

            if (error.code === 'ER_DUP_ENTRY') {

                return res.status(statusCode.RESOURCE_CONFLICT).json({ error: 'Robot ID Already Exists' });

            }

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Robots'});

        }

        logger.info("Successfully Added Robot")

        return res.sendStatus(statusCode.OK)

        }  
    )
}

// Updates Robot
const updateRobot = async (req, res) => {

    logger.info("Updating Robot...");

    const { RobotID, CurrentLoad, RobotStatus, Maintanence } = req.body;

    if (CurrentLoad != 0) {

        return res.status(statusCode.BAD_REQUEST).json({ error: "Cannot Update While The Robot Has A Carrying Load" });

    }

    if (RobotStatus === "En Route") {

        return res.status(statusCode.BAD_REQUEST).json({ error: "Cannot Update While The Robot Is Delivering" });
        
    }

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

        const sqlQuery = `

            UPDATE robot 

            SET CurrentLoad = 0, RobotStatus = ?, Maintanence = ? 

            WHERE RobotID = ? AND RobotStatus != "En Route"

        `;

        await connection.query(sqlQuery, [RobotStatus, Maintanence, RobotID]);

        const updateTransactionsQuery = `

        UPDATE Transactions 

        SET RobotID = NULL

        WHERE TransactionStatus = 'Pending Delivery' 

        AND RobotID = ?

        `;

        await connection.query(updateTransactionsQuery, [RobotID]);

        await connection.commit();

        logger.info("Successfully Updated Robot");

        return res.sendStatus(statusCode.OK);

    } catch (error) {

        if (connection) await connection.rollback();

        logger.error("Error Updating Robot: " + error.message);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Updating Robot" });

    } finally {

        if (connection) connection.release();

    }

};

//Deletes Robot
const deleteRobot = (req, res) => {

    logger.info("Deleting Robot")

    const {RobotID} = req.body

    if(!validateRegularID(RobotID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"RobotID Is Invalid"})

    }

    const sqlQuery = "Update robot Set RobotStatus = 'Retired' Where RobotID = ? AND RobotStatus != 'En Route' AND CurrentLoad = 0"

    pool.query(sqlQuery, [RobotID], (error, results)=>{

            if(error){

                logger.error("Error Deleting Robot: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Deleting Robot'});

            }

            logger.info("Successfully Deleted Robot")

            return res.sendStatus(statusCode.OK)

        }

    )
    
}

module.exports = {getRobot,addRobot,updateRobot,deleteRobot, getFaultyRobot}
