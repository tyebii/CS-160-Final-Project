const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode} = require('../Utils/Formatting')

const getEmployee = (req,res) => {

    const sqlQuery = "Select * From Employee e, Users u Where e.EmployeeID = u.EmployeeID and e.SupervisorID Is Not null" 

    pool.query(sqlQuery, (error,results)=>{

            if(error){

                console.log("Error Getting Employees: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Getting Employees'});

            }

            res.status(statusCode.OK).json(results)

            return;

        }  
    )
}

const getEmployeeID = (req,res) => {

    const employeeID = req.body.EmployeeID

    if(!validateID(employeeID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeID Is Invalid"})

    }

    const sqlQuery = "Select * From Employee Where EmployeeID = ?"

    pool.query(sqlQuery, [employeeID], (error,results) => {

        if(error){

            console.log("Error Getting Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Getting Employee'});
        }

        res.status(statusCode.OK).json(results)

        return;
    })
}

const updateEmployee = (req, res) => {

    let { UserID, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID,  EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID} = req.body;
    
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

    pool.query(sqlQuery, [
        UserNameFirst, UserNameLast, UserPhoneNumber, 
        EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, 
        EmployeeDepartment, EmployeeHourly, SupervisorID, EmployeeID, UserID
    ], (error, results) => {

        if(error){

            console.log("Error Adding Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Employee'});

        }

        res.status(statusCode.OK).json(results)

        return;
    });
};

const deleteEmployee = (req, res) => {

    const employeeID = req.body.EmployeeID

    if(!validateID(employeeID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeID Is Invalid"})

    }

    const sqlQuery = "DELETE e, u FROM Employee e JOIN Users u ON u.EmployeeID = e.EmployeeID WHERE e.EmployeeID = ?"

    pool.query(sqlQuery, [employeeID], (error, results)=>{

        if(error){

            console.log("Error Adding Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Employee'});

        }

        res.status(statusCode.OK).json(results)

        return;
        
    })
}

module.exports = {getEmployee, getEmployeeID, updateEmployee, deleteEmployee}