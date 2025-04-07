//Import the database connection pool
const pool = require('../Database Pool/DBConnections')


//Get total list of employees
const getEmployee = (req,res) => {
    const sqlQuery = "Select * From Employee e, Users u Where e.EmployeeID != ? and e.EmployeeID = u.EmployeeID and e.SupervisorID != '' " 
    pool.query(sqlQuery, req.user.EmployeeID, (err,results)=>{
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json(results)
    })
}

//Get employee by their ID
const getEmployeeID = (req,res) => {
    //Fetch employee ID
    const EmployeeID = req.body.EmployeeID
    const sqlQuery = "Select * From Employee Where EmployeeID = ?"
    pool.query(sqlQuery, [EmployeeID], (err,results) => {
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json(results)
    })
}

//Update the employees information
const updateEmployee = (req, res) => {
    // Destructure employee information from the request body
    const { UserID, EmployeeID, UserNameFirst, UserNameLast, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, UserPhoneNumber, SupervisorID } = req.body;

    console.log(req.body)
    // SQL query to update both employee and user information
    const sqlQuery = `
        UPDATE employee e
        JOIN users u ON e.EmployeeID = u.EmployeeID
        SET 
            u.UserNameFirst = ?, 
            u.UserNameLast = ?, 
            u.UserPhoneNumber = ?, 
            e.EmployeeHireDate = ?, 
            e.EmployeeStatus = ?, 
            e.EmployeeBirthDate = ?, 
            e.EmployeeDepartment = ?, 
            e.EmployeeHourly = ?, 
            e.SupervisorID = ?
        WHERE e.EmployeeID = ? and u.UserID=?;
    `;

    // Execute the query with the provided values
    pool.query(sqlQuery, [
        UserNameFirst, UserNameLast, UserPhoneNumber, 
        EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, 
        EmployeeDepartment, EmployeeHourly, SupervisorID, EmployeeID, UserID
    ], (err, results) => {
        if (err) {
            res.status(500).json({ err: err.message });
            return;
        }
        res.status(200).json({ success: "True" });
    });
};


//Delete the employee
const deleteEmployee = (req, res) => {
    //Fetch EmployeeID
    const EmployeeID = req.body.EmployeeID

    //Delete from DB
    const sqlQuery = "DELETE e, u FROM Employee e JOIN Users u ON u.EmployeeID = e.EmployeeID WHERE e.EmployeeID = ?"
    pool.query(sqlQuery, [EmployeeID], (err, results)=>{
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json({success:"True"})
    })
}

module.exports = {getEmployee, getEmployeeID, updateEmployee, deleteEmployee}