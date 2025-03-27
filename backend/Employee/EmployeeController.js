//Import the database connection pool
const pool = require('../Database Pool/DBConnections')


//Get total list of employees
const getEmployee = (req,res) => {
    const sqlQuery = "Select * From Employee" 
    pool.query(sqlQuery, (err,results)=>{
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
    //EmployeeInformation
    const {EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID} = req.body
    
    //Append the information to DB
    const sqlQuery = "Update employee Set EmployeeHireDate = ?, EmployeeStatus = ?, EmployeeBirthDate = ?, EmployeeDepartment = ?, EmployeeHourly = ?, SupervisorID = ? Where EmployeeID = ?"
    pool.query(sqlQuery, [EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID, EmployeeID], (err, results)=>{
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json({success:"True"})
    })
}

//Delete the employee
const deleteEmployee = (req, res) => {
    //Fetch EmployeeID
    const EmployeeID = req.body.EmployeeID

    //Delete from DB
    const sqlQuery = "Delete From Employee Where EmployeeID = ?"
    pool.query(sqlQuery, [EmployeeID], (err, results)=>{
        if(err){
            res.status(500).json({err:err.message})
            return;
        }
        res.status(200).json({success:"True"})
    })
}

module.exports = {getEmployee, getEmployeeID, updateEmployee, deleteEmployee}