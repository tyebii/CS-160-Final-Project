const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode} = require('../Utils/Formatting')

const getCurrentTransactions = (req, res) => {

    const sqlQuery = "Select Distinct * From Transactions, Users  Where (TransactionStatus = \"Out For Delivery\" or TransactionStatus = \"In Progress\"  or TransactionStatus = \"Complete\")  and Transactions.CustomerID = Users.CustomerID Order By TransactionDate Desc"
    
    pool.query(sqlQuery, (error,results)=>{

        if(error){

            console.log("Error Fetching Current Transactions: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Getting Current Transactions"})

        }

        res.status(statusCode.OK).json(results)

    })
}

const getTransactionID = (req, res) => {

    const {TransactionID} = req.body
    
    if(!validateID(TransactionID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"TransactionID Is Invalid"})

    }

    const sqlQuery = "Select * From Transactions t, Users u Where t.TransactionID = ? And t.CustomerID = u.CustomerID"

    pool.query(sqlQuery, [TransactionID], (error,results) => {

        if(error){

            console.log("Error Fetching Transaction By ID: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Getting Transaction"})

        }

        res.status(statusCode.OK).json(results)

    })
}

const getCustomerTransactions = (req, res) => {

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const sqlQuery = "Select * From Transactions Where CustomerID = ? Order By TransactionDate Desc"

    pool.query(sqlQuery, [customerID], (error,results) => {

        if(error){

            console.log("Error Fetching Customer's Transactions: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Getting Customer's Transactions"})

        }

        res.status(statusCode.OK).json(results)

    })
}

module.exports = {getCurrentTransactions, getTransactionID, getCustomerTransactions}