//Import the database connection pool
const pool = require('../Database Pool/DBConnections')
const { v4: uuidv4 } = require('uuid');

//Get the robot
const getRobot = (req,res) => {
    const sqlQuery = "Select * From robot"
    pool.query(sqlQuery, (err, results)=>{
            if(err){
                res.status(500).json({ err: err.message})
                return;
            }
            res.status(200).json(results)
        }
    )
}

//Get the faulty robots
const getFaultyRobot = (req,res)=>{
    //Get faulty robot from DB
    const sqlQuery = "Select * From FaultyRobots"
    pool.query(sqlQuery, (err, results)=>{
            if(err){
                res.status(500).json({ err: err.message})
                return;
            }
            res.status(200).json(results)
        }
    )
}

//Add a robot 
const addRobot = (req, res) => {
    //Robot data
    const {RobotID, CurrentLoad,RobotStatus, Maintanence, Speed,BatteryLife, EstimatedDelivery} = req.body
    const sqlQuery = "Insert Into Robot(RobotID, CurrentLoad, RobotStatus, Maintanence, Speed, BatteryLife, EstimatedDelivery) Values(?,?,?,?,?,?,?)"
    pool.query(sqlQuery, [RobotID,CurrentLoad,RobotStatus,Maintanence,Speed,BatteryLife,EstimatedDelivery], (err, results)=>{
            if(err){
                res.status(500).json({ err: err.message})
                return;
            }
            res.status(200).json({success:"True"})
        }
    )
}

const updateRobot = (req, res) => {
    const {RobotID, CurrentLoad,RobotStatus, Maintanence, Speed,BatteryLife, EstimatedDelivery} = req.body
    const sqlQuery = "Update robot set CurrentLoad = ?, RobotStatus = ?, Maintanence = ?, Speed = ?, BatteryLife = ?, EstimatedDelivery = ? Where RobotID = ?"
    pool.query(sqlQuery, [CurrentLoad,RobotStatus,Maintanence,Speed,BatteryLife,EstimatedDelivery, RobotID], (err, results)=>{
        if(err){
            res.status(500).json({ err: err.message})
            return;
        }
        res.status(200).json({success:"True"})
    }
)
}

const deleteRobot = (req, res) => {
    const {RobotID} = req.body
    const sqlQuery = "Delete From robot Where RobotID = ?"
    pool.query(sqlQuery, [RobotID], (err, results)=>{
        if(err){
            res.status(500).json({ err: err.message})
            return;
        }
        res.status(200).json({success:"True"})
    }
)
}

module.exports = {getRobot,addRobot,updateRobot,deleteRobot, getFaultyRobot}
