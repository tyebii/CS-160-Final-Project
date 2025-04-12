const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken'); 

require('dotenv').config(); 

const pool = require('../Database Pool/DBConnections');

const {generateHash, generateUniqueID} = require('../Utils/Generation')

const {customerIDExists, employeeIDExists} = require('../Utils/ExistanceChecks')

const {statusCode} = require('../Utils/Formatting')

//Signup Customer
const signUpCustomer = async (req, res) => {


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
            

            return res.sendStatus(statusCode.OK);
        } catch (error) {

            if (connection) {

                await connection.rollback();

                connection.release();
            }
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "The Username Is Already Taken" });
            }

            console.log("Error Signing Up A Customer: " + error.message)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Trying To Signup Customer" });
        }
};

//Signup Employee
const signUpEmployee = async (req, res) => {

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
            

            res.sendStatus(statusCode.OK);

        } catch (error) {

            if (connection) {

                await connection.rollback();

                connection.release();
            }
            
            if (error.code === 'ER_DUP_ENTRY') {

                return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "The Username is Already Taken" });

            }

            console.log("Error Signing Up An Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Trying To Signup" });

        }
}

//Sign Up Manager
const signUpManager = async (req, res) => {

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
        
        res.sendStatus(statusCode.OK);

    } catch (error) {

        if (connection) {

            await connection.rollback();

            connection.release();
        }

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "The Username is Already Taken" });

        }

        console.log("Error Signing Up A Manager: " + error.message)

        res.status(statusCode.BAD_REQUEST).json({ error: error.message });

    }
}

//Login
const login = async (req, res) => {
    try {

        let {UserID, Password} = req.body;


        const connection = await pool.promise().getConnection();

            const sqlQueryOne =  `SELECT users.password, users.employeeid, users.customerid, employee.supervisorid FROM users LEFT JOIN employee ON users.EmployeeId = employee.EmployeeID WHERE users.UserID = ?`

            const [rows] = await connection.query(sqlQueryOne, [UserID]);

        connection.release(); 

        if (rows.length === 0) {

            return res.status(statusCode.UNAUTHORIZED).json({ error: "Wrong Credentials" });

        }

        try{

            if (!(await bcrypt.compare(Password, rows[0].password))) {

                return res.status(statusCode.UNAUTHORIZED).json({ error: "Wrong Credentials" });

            }

        }catch(error){

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:"Issue With Bcrypt Compare"})

        }

        const user = {
            UserID: UserID,
            EmployeeID: rows[0].employeeid,
            CustomerID: rows[0].customerid,
            SupervisorID: rows[0].supervisorid 
        };
        

        const accessToken = jwt.sign(user, process.env.Secret_Key, { expiresIn: '1h' });

        return res.status(statusCode.OK).json({ accessToken });

    } catch (error) {

        if (connection) {

            await connection.rollback();

            connection.release();
        }

        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: error.message});
    }
};




module.exports = {login, signUpCustomer, signUpEmployee, signUpManager, }