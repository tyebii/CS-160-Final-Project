//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const getCurrentTransactions = (req, res) => {
    const sqlQuery = "Select Distinct * From Transactions, Users  Where (TransactionStatus = \"Out For Delivery\" or TransactionStatus = \"In Progress\")  and Transactions.CustomerID = Users.CustomerID Order By TransactionDate Desc"
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
    const sqlQuery = "Select * From Transactions t, Users u Where t.TransactionID = ? And t.CustomerID = u.CustomerID"
    pool.query(sqlQuery, [TransactionID], (err,results) => {
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json(results)
    })
}

const getCustomerTransactions = (req, res) => {
    const CustomerID = req.user.CustomerID
    const sqlQuery = "Select * From Transactions Where CustomerID = ? Order By TransactionDate Desc"
    pool.query(sqlQuery, [CustomerID], (err,results) => {
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json(results)
    })
}

module.exports = {getCurrentTransactions, getTransactionID, getCustomerTransactions}