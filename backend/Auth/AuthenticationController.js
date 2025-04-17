const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken'); 

require('dotenv').config(); 

const pool = require('../Database Pool/DBConnections');

const {generateHash, generateUniqueID} = require('../Utils/Generation')

const {customerIDExists, employeeIDExists} = require('../Utils/ExistanceChecks')

const {statusCode} = require('../Utils/Formatting')

const logger = require('../Utils/Logger'); 

//Signup Customer
const signUpCustomer = async (req, res) => {

        logger.info("Signing Up Customer...")

        let connection;
    
        try {

            connection = await pool.promise().getConnection(); 

            await connection.beginTransaction();

                let { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

                let hashedPassword = await generateHash(Password);

                let CustomerID = await generateUniqueID(customerIDExists);
    
                const sqlQueryOne = 'INSERT INTO customer (CustomerID, JoinDate) VALUES (?, ?)'

                await connection.query(

                    sqlQueryOne, 

                    [CustomerID, new Date()]

                );
        

                const sqlQueryTwo = 'INSERT INTO users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES (?, ?, ?, ?, ?, NULL, ?)'
                
                await connection.query(

                    sqlQueryTwo, 

                    [UserID, hashedPassword, UserNameFirst, UserNameLast, UserPhoneNumber, CustomerID]

                );
        

            await connection.commit();
    
            connection.release();

            logger.info("Successfully Signed Up")
            
            return res.sendStatus(statusCode.OK);

        } catch (error) {

            logger.error("Error Signing Customer Up: " + error.message)

            if (connection) {

                try {
    
                    logger.info("Rolling Back Connection");
    
                    await connection.rollback();
    
                } catch (rollbackError) {
    
                    logger.error("Error During Rollback: " + rollbackError.message);
    
                }
            
                try {
    
                    logger.info("Releasing Connection");
    
                    connection.release();
    
                } catch (releaseError) {
    
                    logger.error("Error Releasing Connection: " + releaseError.message);
    
                }
                
            }
            
            if (error.code === 'ER_DUP_ENTRY') {

                return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "The Username Is Already Taken" });
            
            }

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Trying To Signup Customer" });
        
        }

};

//Signup Employee
const signUpEmployee = async (req, res) => {

        logger.info("Signing Up Employee")

        let connection;
    
        try {

            connection = await pool.promise().getConnection(); 

            await connection.beginTransaction();

                let { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID} = req.body;


                let hashedPassword = await generateHash(Password)



                let EmployeeID = await generateUniqueID(employeeIDExists)
    

                const sqlQueryOne = 'INSERT INTO Employee (EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) VALUES (?,?,?,?,?,?,?)'
                
                await connection.query(
                    sqlQueryOne, 
                    [EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID]
                );

                const sqlQueryTwo = 'INSERT INTO users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES (?, ?, ?, ?, ?, ?, Null)'
                
                await connection.query(
                    sqlQueryTwo, 
                    [UserID, hashedPassword, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID]
                );
    

            await connection.commit();
    

            connection.release();
            
            logger.info("Successfully Signed Up Employee")

            return res.sendStatus(statusCode.OK);

        } catch (error) {

            logger.error("Error Signing Employee Up: " + error.message)

            if (connection) {

                try {
    
                    logger.info("Rolling Back Connection");
    
                    await connection.rollback();
    
                } catch (rollbackError) {
    
                    logger.error("Error During Rollback: " + rollbackError.message);
    
                }
            
                try {
    
                    logger.info("Releasing Connection");
    
                    connection.release();
    
                } catch (releaseError) {
    
                    logger.error("Error Releasing Connection: " + releaseError.message);
    
                }
                
            }
            
            if (error.code === 'ER_DUP_ENTRY') {

                return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "The Username is Already Taken" });

            }

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Trying To Signup" });

        }

}

//Sign Up Manager
const signUpManager = async (req, res) => {

    logger.info("Signing Up Manager...")

    let connection;

    try {

        connection = await pool.promise().getConnection(); 

        await connection.beginTransaction();

            let { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, Secret} = req.body;

            if(Secret!=process.env.Secret){

                return res.status(statusCode.UNAUTHORIZED).json({error:"Not Authorized"})

            }

            let hashedPassword = await generateHash(Password)

            let EmployeeID = await generateUniqueID(employeeIDExists)

            const sqlQueryOne = 'INSERT INTO Employee (EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) VALUES (?,?,?,?,?,?,Null)'

            await connection.query(

                sqlQueryOne, 

                [EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly]

            );

            const sqlQueryTwo = 'INSERT INTO users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES (?, ?, ?, ?, ?, ?, Null)'

            await connection.query(

                sqlQueryTwo, 

                [UserID, hashedPassword, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID]

            );

        await connection.commit();

        connection.release();

        logger.info("Successfully Signingup Manager")
        
        return res.sendStatus(statusCode.OK);

    } catch (error) {

        logger.error("Error Signing Manager Up: " + error.message)

        if (connection) {

            try {

                logger.info("Rolling Back Connection");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Error During Rollback: " + rollbackError.message);

            }
        
            try {

                logger.info("Releasing Connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Error Releasing Connection: " + releaseError.message);

            }
            
        }

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "The Username is Already Taken" });

        }

        return res.status(statusCode.BAD_REQUEST).json({ error: error.message });

    }
}

//Login
const login = async (req, res) => {

    logger.info("Login Starting...")

    try {

        let {UserID, Password} = req.body;

        const connection = await pool.promise().getConnection();

            const sqlQueryOne =  `SELECT users.password, users.employeeid, users.customerid, employee.supervisorid FROM users LEFT JOIN employee ON users.EmployeeId = employee.EmployeeID WHERE users.UserID = ?`

            const [rows] = await connection.query(sqlQueryOne, [UserID]);

        connection.release(); 

        if (rows.length === 0) {

            logger.error("Wrong Credentials")

            return res.status(statusCode.UNAUTHORIZED).json({ error: "Wrong Credentials" });

        }

        try{

            if (!(await bcrypt.compare(Password, rows[0].password))) {

                logger.error("Wrong Credentials")

                return res.status(statusCode.UNAUTHORIZED).json({ error: "Wrong Credentials" });

            }

        }catch(error){

            logger.error("Error With Bcrypt: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:"Issue With Bcrypt Compare"})

        }

        const user = {
            UserID: UserID,
            EmployeeID: rows[0].employeeid,
            CustomerID: rows[0].customerid,
            SupervisorID: rows[0].supervisorid 
        };
        

        const accessToken = jwt.sign(user, process.env.Secret_Key, { expiresIn: '1h' });

        logger.info("Successfully Logged In")

        return res.status(statusCode.OK).json({ accessToken });

    } catch (error) {

        logger.error("Error Signing Manager Up: " + error.message)

        if (connection) {

            try {

                logger.info("Rolling Back Connection");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Error During Rollback: " + rollbackError.message);

            }
        
            try {

                logger.info("Releasing Connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Error Releasing Connection: " + releaseError.message);

            }
            
        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: error.message});

    }

};

module.exports = {login, signUpCustomer, signUpEmployee, signUpManager, }