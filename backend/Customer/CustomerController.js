//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

//Gets the customer information
const getCustomer = (req, res) => {
    //Get the customer id
    const customerID = req.user.CustomerID
    //Query essential customer information
    const sqlQuery = "SELECT UserID, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, c.CustomerID, c.JoinDate FROM customer c INNER JOIN users u ON c.CustomerID = u.CustomerID WHERE c.CustomerID = ?"
    pool.query(sqlQuery, [customerID], (err, results)=>{
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json(results)
    })
}

module.exports = {getCustomer}