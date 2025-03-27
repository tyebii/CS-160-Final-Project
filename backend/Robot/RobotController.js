//Import the database connection pool
const pool = require('../Database Pool/DBConnections')
const { v4: uuidv4 } = require('uuid');

//Get the robot
const getRobot = (req,res) => {
    //Get the ID of the robot
    const {RobotID} = req.body
    
    //Get the robot information
    const sqlQuery = "Select * From robot where RobotID = ?"
    pool.query(sqlQuery, RobotID, (err, results)=>{
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
    const {CurrentLoad,RobotAddress,RobotStatus, Maintanence, Speed,BatteryLife, EstimatedDelivery} = req.body
    const RobotID = uuidv4();
    const sqlQuery = "Insert Into Robot(RobotID, CurrentLoad, RobotAddress, RobotStatus, Maintanence, Speed, BatteryLife, EstimatedDelivery) Values(?,?,?,?,?,?,?,?)"
    pool.query(sqlQuery, [RobotID,CurrentLoad,RobotAddress,RobotStatus,Maintanence,Speed,BatteryLife,EstimatedDelivery], (err, results)=>{
            if(err){
                res.status(500).json({ err: err.message})
                return;
            }
            res.status(200).json({success:"True"})
        }
    )
}

const updateRobot = (req, res) => {
    const {RobotID, CurrentLoad,RobotAddress,RobotStatus, Maintanence, Speed,BatteryLife, EstimatedDelivery} = req.body
    const sqlQuery = "Update robot set CurrentLoad = ?, RobotAddress = ?, RobotStatus = ?, Maintanence = ?, Speed = ?, BatteryLife = ?, EstimatedDelivery = ? Where RobotID = ?"
    pool.query(sqlQuery, [CurrentLoad,RobotAddress,RobotStatus,Maintanence,Speed,BatteryLife,EstimatedDelivery, RobotID], (err, results)=>{
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
