const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger')

//Gets The Customer's Information
const getCustomer = (req, res) => {

    const customerID = req.user?.CustomerID

    logger.info("Fetching The Customer's Information With ID: " + customerID)

    if(!validateID(customerID)){

        logger.error("The Format For Fetching Customer With ID " + customerID + " Information Is Invalid")
        
        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Has Invalid Format"})

    }

    logger.info("Now Getting Customer Information For " + customerID + " From The Database")

    const sqlQuery = "SELECT UserID, UserNameFirst, UserNameLast, UserPhoneNumber, c.CustomerID, c.JoinDate FROM customer c INNER JOIN users u ON c.CustomerID = u.CustomerID WHERE c.CustomerID = ?"

    pool.query(sqlQuery, [customerID], (error, results)=>{

        if(error){

            logger.error("Error Accessing Customer Information For Customer " + customerID + " :" + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Fetching Customer Information"})

        }

        logger.info("Information For Customer " + customerID + " Has Been Fetched")

        return res.status(statusCode.OK).json(results)

    })
    
}

//Gets The Employees Information
const getEmployee = (req, res) => {

    const employeeID = req.user?.EmployeeID

    logger.info("Fetching The Employee's Information With Employee ID: " + employeeID)

    if(!validateID(employeeID)){

        logger.error("The Format For Fetching Employee With ID " + employeeID + " Information Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Employee ID Is Invalid"})

    }

    logger.info("Getting Customer Information For " + employeeID)

    const sqlQuery = "SELECT * FROM employee e INNER JOIN users u ON e.EmployeeID = u.EmployeeID WHERE e.EmployeeID = ?"

    pool.query(sqlQuery, [employeeID], (error, results)=>{

        if(error){

            logger.error("Error Accessing Employee Information For ID " + employeeID + " : " + error.message)

            return res.status(statusCode.SERVICE_UNAVAILABLE).json({error: "Internal Server Error Fetching Employee Information"})

        }

        logger.info("Information For Employee " + employeeID + " Has Been Fetched")

        return res.status(statusCode.OK).json(results)

    })

}

module.exports = {getCustomer, getEmployee}