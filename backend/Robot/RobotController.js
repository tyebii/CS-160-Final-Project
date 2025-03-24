//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const getRobot = (req,res) => {
    const {RobotID} = req.body
    const sqlQuery = "Select * From robot where RobotID = ?"
    pool.query(sqlQuery, RobotID, (err, results)=>{
            if(err){
                res.status(500).json({ err: err.message})
            }
            res.status(200).json(results)
        }
    )
}
