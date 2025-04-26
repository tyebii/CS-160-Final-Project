const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger'); 

//Getting Customer Transactions
const getCurrentTransactions = (req, res) => {

    logger.info("Getting Current Transactions")

    const sqlQuery = "Select Distinct * From Transactions, Users  Where (TransactionStatus = \"Pending Delivery\" or TransactionStatus = \"In Progress\"  or TransactionStatus = \"Complete\" or TransactionStatus = \"Delivering\")  and Transactions.CustomerID = Users.CustomerID Order By TransactionDate Desc, RobotID ASC"
    
    pool.query(sqlQuery, (error,results)=>{

        if(error){

            logger.error("Error Fetching Current Transactions: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Getting Current Transactions"})

        }

        logger.info("Successfully Retrieved Current Transactions")

        return res.status(statusCode.OK).json(results)

    })
    
}

//Fulfill Complete Order
const fullfillOrder = (req, res) => {

    logger.info("Fulfilling Order...")

    const {TransactionID} = req.body

    if(!validateID(TransactionID)){

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Fulfilling Transaction"})

    }

    pool.query('Update transactions Set TransactionStatus = "Fulfilled" Where TransactionID = ? AND TransactionStatus = "Complete" ', TransactionID, (error,results) => {
        
        if(error){

            logger.error("Error Fulfilling Order: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Fulfilling Transaction"})

        }

        logger.info("Successfully Fulfilled")

        return res.sendStatus(statusCode.OK)

    })
        
    

}

//Getting Transaction By ID
const getTransactionID = (req, res) => {

    logger.info("Getting Transaction By ID")

    const {TransactionID} = req.body
    
    if(!validateID(TransactionID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"TransactionID Is Invalid"})

    }

    const sqlQuery = "Select * From Transactions t, Users u Where t.TransactionID = ? And t.CustomerID = u.CustomerID"

    pool.query(sqlQuery, [TransactionID], (error,results) => {

        if(error){

            logger.error("Error Fetching Transaction By ID: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Getting Transaction"})

        }

        logger.info("Successfully Retrieved Transaction By ID")

        return res.status(statusCode.OK).json(results)

    })

}

//Getting All Customer Transactions
const getCustomerTransactions = (req, res) => {

    logger.info("Getting Customer's Transactions")

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const sqlQuery = "Select * From Transactions Where CustomerID = ? And TransactionStatus != 'In Progress' Order By TransactionDate Desc"

    pool.query(sqlQuery, [customerID], (error,results) => {

        if(error){

            logger.error("Error Fetching Customer's Transactions: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Getting Customer's Transactions"})

        }

        logger.info("Successfully Got Customer Transactions")

        return res.status(statusCode.OK).json(results)

    })

}

module.exports = {getCurrentTransactions, getTransactionID, getCustomerTransactions, fullfillOrder}