//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

//Gets the customer information
const getCustomer = (req, res) => {
    //Get the customer id
    const customerID = req.user.CustomerID

    //CustomerID is null
    if(customerID==null){
        return res.status(500).json({error:"Customer ID is Null"})
    }

    //Query essential customer information
    const sqlQuery = "SELECT UserID, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, c.CustomerID, c.JoinDate FROM customer c INNER JOIN users u ON c.CustomerID = u.CustomerID WHERE c.CustomerID = ?"
    pool.query(sqlQuery, [customerID], (error, results)=>{
        if(error){
            res.status(500).json({error: "Database Error: " + error.message})
            return;
        }
        res.status(200).json(results)
    })
}

//Gets the employee information
const getEmployee = (req, res) => {
    //Get the employee id
    const employeeID = req.user.EmployeeID

    //Employee Id is null
    if(employeeID==null || employeeID==""){
        return res.status(500).json({error:"Employee ID is Null"})
    }

    //Query essential employee information
    const sqlQuery = "SELECT * FROM employee e INNER JOIN users u ON e.EmployeeID = u.EmployeeID WHERE e.EmployeeID = ?"
    pool.query(sqlQuery, [employeeID], (error, results)=>{
        if(error){
            res.status(500).json({error: "Database Error: " + error.message})
            return;
        }
        res.status(200).json(results)
    })
}

module.exports = {getCustomer, getEmployee}