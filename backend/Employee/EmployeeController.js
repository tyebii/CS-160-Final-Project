const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger'); 

//Gets The Employees
const getEmployee = (req,res) => {

    logger.info("Getting Employees...")

    const sqlQuery = "Select * From Employee e, Users u Where e.EmployeeID = u.EmployeeID and e.SupervisorID Is Not null" 

    pool.query(sqlQuery, (error,results)=>{

            if(error){

                logger.error("Error Getting Employees: " + error.message)

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Getting Employees'});

            }

            logger.info("Employees Fetched Successfully")

            return res.status(statusCode.OK).json(results)

        }  
    )
}

//Gets The Employee Information By ID
const getEmployeeID = (req,res) => {

    logger.info("Get Employee Information By Their ID")

    const employeeID = req.body.EmployeeID

    if(!validateID(employeeID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeID Is Invalid"})

    }

    const sqlQuery = "Select * From Employee Where EmployeeID = ?"

    pool.query(sqlQuery, [employeeID], (error,results) => {

        if(error){

            logger.error("Error Getting Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Getting Employee'});
        }

        logger.info("Employee Information Fetched By Their ID")

        return res.status(statusCode.OK).json(results)

    })

}

//Updates The Employee
const updateEmployee = (req, res) => {

    logger.info("Updating The Employee")

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

            logger.error("Error Update Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Employee'});

        }

        logger.info("Successfully Updated Employee")

        return res.status(statusCode.OK).json(results)

    });

};

//Delete The Employee
const deleteEmployee = (req, res) => {
    
    logger.info("Deleting The Employee")

    const employeeID = req.body.EmployeeID

    if(!validateID(employeeID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeID Is Invalid"})

    }

    const sqlQuery = "DELETE e, u FROM Employee e JOIN Users u ON u.EmployeeID = e.EmployeeID WHERE e.EmployeeID = ?"

    pool.query(sqlQuery, [employeeID], (error, results)=>{

        if(error){

            logger.error("Error Deleting Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Employee'});

        }

        logger.info("Successfully Deleted Employee")

        return res.status(statusCode.OK).json(results)
        
    })

}

module.exports = {getEmployee, getEmployeeID, updateEmployee, deleteEmployee}