//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const getCurrentTransactions = (req, res) => {
    const sqlQuery = "Select * From Transactions Where TransactionStatus = \"In Progress\""
    pool.query(sqlQuery, (err,results)=>{
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json(results)
    })
}

const getTransactionID = (req, res) => {
    const {TransactionID} = req.body
    const sqlQuery = "Select * From Transactions Where TransactionID = ?"
    pool.query(sqlQuery, [TransactionID], (err,results) => {
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json(results)
    })
}

module.exports = {getCurrentTransactions, getTransactionID}