//Import the database connection pool
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


const addRobot = (req, res) => {

    logger.info("Adding Robot")

    const {RobotID, CurrentLoad,RobotStatus, Maintanence} = req.body

    const sqlQuery = "Insert Into Robot(RobotID, CurrentLoad, RobotStatus, Maintanence) Values(?,?,?,?)"
    
    pool.query(sqlQuery, [RobotID,CurrentLoad,RobotStatus,Maintanence], (error, results)=>{

        if(error){

            logger.error("Error Adding Robots: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Robots'});

        }

        logger.info("Successfully Added Robot")

        return res.sendStatus(statusCode.OK)

        }  
    )
}

const updateRobot = (req, res) => {

    logger.info("Updating Robot...")

    const {RobotID, CurrentLoad, RobotStatus, Maintanence} = req.body

    const sqlQuery = "Update robot set CurrentLoad = ?, RobotStatus = ?, Maintanence = ? Where RobotID = ?"

    pool.query(sqlQuery, [CurrentLoad,RobotStatus, Maintanence, RobotID], (error, results)=>{

        if(error){

            logger.error("Error Updating Robots: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Robots'});

        }

        logger.info("Successfully Updated")

        return res.sendStatus(statusCode.OK)
        
        }  
    )
}

const deleteRobot = (req, res) => {

    logger.info("Deleting Robot")

    const {RobotID} = req.body

    if(!validateRegularID(RobotID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"RobotID Is Invalid"})

    }

    const sqlQuery = "Update robot Set RobotStatus = 'Retired' Where RobotID = ?"

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
