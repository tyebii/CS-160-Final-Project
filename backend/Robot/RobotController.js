//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const {validateRegularID, statusCode} = require('../Utils/Formatting')

const getRobot = (req,res) => {

    const sqlQuery = "Select * From robot"

    pool.query(sqlQuery, (error, results)=>{

            if(error){

                console.log("Error Fetching Robots: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Robots'});

            }

            res.status(statusCode.OK).json(results)

            return;
        }
    )
}


const getFaultyRobot = (req,res)=>{

    const sqlQuery = "Select * From FaultyRobots"

    pool.query(sqlQuery, (error, results)=>{

            if(error){

                console.log("Error Fetching Faulty Robots: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Faulty Robots'});

            }

            res.status(statusCode.OK).json(results)

            return;

        }
    )
}


const addRobot = (req, res) => {

    const {RobotID, CurrentLoad,RobotStatus, Maintanence, Speed,BatteryLife, EstimatedDelivery} = req.body

    const sqlQuery = "Insert Into Robot(RobotID, CurrentLoad, RobotStatus, Maintanence, Speed, BatteryLife, EstimatedDelivery) Values(?,?,?,?,?,?,?)"
    
    pool.query(sqlQuery, [RobotID,CurrentLoad,RobotStatus,Maintanence,Speed,BatteryLife,EstimatedDelivery], (error, results)=>{

        if(error){

            console.log("Error Adding Robots: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Robots'});

        }

        res.sendStatus(statusCode.OK)

        return;

        }  
    )
}

const updateRobot = (req, res) => {

    const {RobotID, CurrentLoad,RobotStatus, Maintanence, Speed,BatteryLife, EstimatedDelivery} = req.body

    const sqlQuery = "Update robot set CurrentLoad = ?, RobotStatus = ?, Maintanence = ?, Speed = ?, BatteryLife = ?, EstimatedDelivery = ? Where RobotID = ?"

    pool.query(sqlQuery, [CurrentLoad,RobotStatus, Maintanence, Speed,BatteryLife, EstimatedDelivery, RobotID], (error, results)=>{

        if(error){

            console.log("Error Updating Robots: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Robots'});

        }

        res.sendStatus(statusCode.OK)

        return;
        
        }  
    )
}

const deleteRobot = (req, res) => {
    const {RobotID} = req.body

    if(!validateRegularID(RobotID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"RobotID Is Invalid"})

    }

    const sqlQuery = "Delete From robot Where RobotID = ?"

    pool.query(sqlQuery, [RobotID], (error, results)=>{

            if(error){

                console.log("Error Deleting Robot: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Deleting Robot'});

            }

            res.sendStatus(statusCode.OK)

            return;
        }
    )
}

module.exports = {getRobot,addRobot,updateRobot,deleteRobot, getFaultyRobot}
