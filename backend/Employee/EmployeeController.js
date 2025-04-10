//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const {hasSpaces}  = require ("../Auth/AuthenticationController")

//Get total list of employee
const getEmployee = (req,res) => {
    const sqlQuery = "Select * From Employee e, Users u Where e.EmployeeID = u.EmployeeID and e.SupervisorID Is Not null" 
    pool.query(sqlQuery, (error,results)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }
        return res.status(200).json(results)
    })
}

//Get employee by their ID
const getEmployeeID = (req,res) => {
    //Fetch employee ID
    const employeeID = req.body.EmployeeID

    //Employee Id is null
    if(employeeID==null || employeeID==""){
        return res.status(500).json({error:"Employee ID is Null"})
    }

    const sqlQuery = "Select * From Employee Where EmployeeID = ?"
    pool.query(sqlQuery, [employeeID], (error,results) => {
        if(error){
            return res.status(500).json({error:error.message})
        }
        return res.status(200).json(results)
    })
}

//Update the employees information
const appendEmployee = (req, res) => {
    // Destructure employee information from the request body
    let { UserID, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID,  EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID} = req.body;
    
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
    ], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        return res.status(200).json({ success: "True" });
    });
};


//Delete the employee
const deleteEmployee = (req, res) => {
    //Fetch employee ID
    const employeeID = req.body.EmployeeID

    //Employee Id is null
    if(employeeID==null || employeeID==""){
        return res.status(500).json({error:"Employee ID is Null"})
    }

    //Delete from DB
    const sqlQuery = "DELETE e, u FROM Employee e JOIN Users u ON u.EmployeeID = e.EmployeeID WHERE e.EmployeeID = ?"
    pool.query(sqlQuery, [employeeID], (error, results)=>{
        if(error){
            res.status(500).json({error:error.message})
            return;
        }
        res.status(200).json({success:"True"})
    })
}





//------------------------------------Format Employee Update------------------------//
function EmployeeFormat(req, res, next) {

    //--------------------Precheck for Lowercase---------------//
    if (!req.body.UserID) {
        return res.status(400).json({ error: "Please Fill In User ID" });
    }

    if (typeof req.body.UserID  !== "string") {
        return res.status(400).json({ error: "User ID Must Be A String" });
    }

    //Turn the userid lowercase
    req.body.UserID = req.body.UserID.toLowerCase();

    //Destructure Body
    const { UserID, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    //------------------Null Checks-------------//

    if (!UserNameFirst) {
        return res.status(400).json({ error: "Please Fill In First Name" });
    }

    if (!UserNameLast) {
        return res.status(400).json({ error: "Please Fill In Last Name" });
    }

    if (!UserPhoneNumber) {
        return res.status(400).json({ error: "Please Fill In Phone Number" });
    }


    //----------------------Type Checking-------------------//

    if (typeof UserNameFirst !== "string") {
        return res.status(400).json({ error: "First Name Must Be A String" });
    }

    if (typeof UserNameLast !== "string") {
        return res.status(400).json({ error: "Last Name Must Be A String" });
    }

    if (typeof UserPhoneNumber !== "string") {
        return res.status(400).json({ error: "Phone Number Must Be A String" });
    }

    //-------------------Space Format Checking--------------//
    if (hasSpaces(UserID)) {
        return res.status(400).json({ error: "User ID Must Not Contain Spaces" });
    }

    if (hasSpaces(UserNameFirst)) {
        return res.status(400).json({ error: "First Name Must Not Contain Spaces" });
    }

    if (hasSpaces(UserNameLast)) {
        return res.status(400).json({ error: "Last Name Must Not Contain Spaces" });
    }

    if (hasSpaces(UserPhoneNumber)) {
        return res.status(400).json({ error: "Phone Number Must Not Contain Spaces" });
    }

    //-------------------------Length Checking-----------------//

    if (UserID.length < 5) {
        return res.status(400).json({ error: "User ID Must Be At Least 5 Characters Long" });
    }

    if (UserID.length > 255) {
        return res.status(400).json({ error: "User ID Must Be Less Than or Equal To 255 Characters Long" });
    }

    if (UserNameFirst.length < 2) {
        return res.status(400).json({ error: "First Name Must Be At Least 2 Characters Long" });
    }

    if (UserNameFirst.length > 255) {
        return res.status(400).json({ error: "First Name Must Be Less Than or Equal To 255 Characters Long" });
    }

    if (UserNameLast.length < 2) {
        return res.status(400).json({ error: "Last Name Must Be At Least 2 Characters Long" });
    }

    if (UserNameLast.length > 255) {
        return res.status(400).json({ error: "Last Name Must Be Less Than or Equal To 255 Characters Long" });
    }



    //-----------------------------Format Checking-----------------------//
    const regexNumber = /^1-\d{3}-\d{3}-\d{4}$/;

    if (!UserPhoneNumber.match(regexNumber)) {
        return res.status(400).json({ error: "Phone Number Must Be In The Format 1-XXX-XXX-XXXX" });
    }

    next();
}

module.exports = {getEmployee, getEmployeeID, appendEmployee, deleteEmployee, EmployeeFormat}