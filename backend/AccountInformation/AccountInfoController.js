const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode} = require('../Utils/Formatting')

//Gets The Customer's Information
const getCustomer = (req, res) => {

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){
        
        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const sqlQuery = "SELECT UserID, UserNameFirst, UserNameLast, UserPhoneNumber, c.CustomerID, c.JoinDate FROM customer c INNER JOIN users u ON c.CustomerID = u.CustomerID WHERE c.CustomerID = ?"

    pool.query(sqlQuery, [customerID], (error, results)=>{

        if(error){

            console.log("Error Accessing Customer Information: " + error.message)

            return res.status(statusCode.SERVICE_UNAVAILABLE).json({error: "Internal Server Error Fetching Customer Information"})

        }

        return res.status(statusCode.OK).json(results)

    })
}

//Gets The Employees Information
const getEmployee = (req, res) => {

    const employeeID = req.user?.EmployeeID

    if(!validateID(employeeID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Employee ID Is Invalid"})

    }

    const sqlQuery = "SELECT * FROM employee e INNER JOIN users u ON e.EmployeeID = u.EmployeeID WHERE e.EmployeeID = ?"

    pool.query(sqlQuery, [employeeID], (error, results)=>{

        if(error){

            console.log("Error Accessing Employee Information: " + error.message)

            return res.status(statusCode.SERVICE_UNAVAILABLE).json({error: "Internal Server Error Fetching Employee Information"})

        }

        return res.status(statusCode.OK).json(results)

    })
}

module.exports = {getCustomer, getEmployee}