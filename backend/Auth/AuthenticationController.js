//Import the database connection pool
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 
const pool = require('../Database Pool/DBConnections')

//Signs Up Customers
const signUpCustomer = async (req, res) => {
        //DB connection
        let connection;
    
        try {
            //Deconstructing payload
            const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;
            
            //Check if UserID is taken 
            userNameExists(UserID);

            // Hashed Password
            const salt = await bcrypt.genSalt(10); // Generates the salt -- purpose: can't use list of precomputed hashes
            const hashedPassword = await bcrypt.hash(Password, salt); //Generates the hash based on round factor of salt
    
            //Unique ID
            let CustomerID = uuidv4(); // Generates a cryptographically safe unique customer ID'
            
            //In case of collisions
            while(customerIDExists(CustomerID)){
                CustomerID = uuidv4();
            }

            //Create the database connection and promisify to enable synchronous computation
            connection = await pool.promise().getConnection(); 
    
            // Start a transaction -- purpose: ensures atomicity
            await connection.beginTransaction();
    
            //Insert the new customer info synchronously -- purpose: needs to occur prior to user info insertion, otherwise error
            const sqlQueryOne = 'INSERT INTO customer (CustomerID, JoinDate) VALUES (?, ?)'
            await connection.query(
                sqlQueryOne, 
                [CustomerID, new Date()]
            );
    
            //Insert user info synchronously
            const sqlQueryTwo = 'INSERT INTO users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES (?, ?, ?, ?, ?, NULL, ?)'
            await connection.query(
                sqlQueryTwo, 
                [UserID, hashedPassword, UserNameFirst, UserNameLast, UserPhoneNumber, CustomerID]
            );
    
            // Commit the transaction -- purpose: means the transaction is complete
            await connection.commit();
    
            // Release the connection back to the pool
            connection.release();
            
            //Return successful 
            res.status(200).json({ success: true });
        } catch (err) {
            //If error occurred prior to connection release
            if (connection) {
                //Rollback the database to state prior to transaction
                await connection.rollback();
                //Release connection
                connection.release();
            }
            
            //Return error and error message
            res.status(500).json({ error: err.message });
        }
};

//Signup Employees
const signUpEmployee = async (req, res) => {
        //DB connection
        let connection;
    
        try {
            //Deconstructing payload
            const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID} = req.body;
            
            //Check if UserID is taken 
            userNameExists(UserID);

            // Hashed Password
            const salt = await bcrypt.genSalt(10); // Generates the salt -- purpose: can't use list of precomputed hashes
            const hashedPassword = await bcrypt.hash(Password, salt); //Generates the hash based on round factor of salt
    
            //Unique ID
            let EmployeeID = uuidv4(); // Generates a cryptographically safe unique employee ID'
            
            //In case of collisions
            while(employeeIDExists(EmployeeID)){
                EmployeeID = uuidv4();
            }

            //Create the database connection and promisify to enable synchronous computation
            connection = await pool.promise().getConnection(); 
    
            // Start a transaction -- purpose: ensures atomicity
            await connection.beginTransaction();
    
            //Insert the new employee info synchronously -- purpose: needs to occur prior to user info insertion, otherwise error
            const sqlQueryOne = 'INSERT INTO Employee (EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) VALUES (?,?,?,?,?,?,?)'
            await connection.query(
                sqlQueryOne, 
                [EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID]
            );
    
            //Insert user info synchronously
            const sqlQueryTwo = 'INSERT INTO users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES (?, ?, ?, ?, ?, ?, Null)'
            await connection.query(
                sqlQueryTwo, 
                [UserID, hashedPassword, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID]
            );
    
            // Commit the transaction -- purpose: means the transaction is complete
            await connection.commit();
    
            // Release the connection back to the pool
            connection.release();
            
            //Return successful 
            res.status(200).json({ success: true });
        } catch (err) {
            //If error occurred prior to connection release
            if (connection) {
                //Rollback the database to state prior to transaction
                await connection.rollback();
                //Release connection
                connection.release();
            }
            
            //Return error and error message
            res.status(500).json({ error: err.message });
        }
}

//Signup Employees
const signUpManager = async (req, res) => {
    //DB connection
    let connection;

    try {
        //Deconstructing payload
        const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly} = req.body;
        
        //Check if UserID is taken 
        userNameExists(UserID);

        // Hashed Password
        const salt = await bcrypt.genSalt(10); // Generates the salt -- purpose: can't use list of precomputed hashes
        const hashedPassword = await bcrypt.hash(Password, salt); //Generates the hash based on round factor of salt

        //Unique ID
        let EmployeeID = uuidv4(); // Generates a cryptographically safe unique employee ID'
        
        //In case of collisions
        while(employeeIDExists(EmployeeID)){
            EmployeeID = uuidv4();
        }

        //Create the database connection and promisify to enable synchronous computation
        connection = await pool.promise().getConnection(); 

        // Start a transaction -- purpose: ensures atomicity
        await connection.beginTransaction();

        //Insert the new employee info synchronously -- purpose: needs to occur prior to user info insertion, otherwise error
        const sqlQueryOne = 'INSERT INTO Employee (EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) VALUES (?,?,?,?,?,?,Null)'
        await connection.query(
            sqlQueryOne, 
            [EmployeeID, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly]
        );

        //Insert user info synchronously
        const sqlQueryTwo = 'INSERT INTO users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES (?, ?, ?, ?, ?, ?, Null)'
        await connection.query(
            sqlQueryTwo, 
            [UserID, hashedPassword, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID]
        );

        // Commit the transaction -- purpose: means the transaction is complete
        await connection.commit();

        // Release the connection back to the pool
        connection.release();
        
        //Return successful 
        res.status(200).json({ success: true });
    } catch (err) {
        //If error occurred prior to connection release
        if (connection) {
            //Rollback the database to state prior to transaction
            await connection.rollback();
            //Release connection
            connection.release();
        }
        
        //Return error and error message
        res.status(500).json({ error: err.message });
    }
}

//Logs in customers and employees 
const login = async (req, res) => {
    try {
        //Data in the payload
        const {UserID, Password} = req.body;
        console.log(UserID, Password)
        //Starts  the database connection 
        const connection = await pool.promise().getConnection();

        //Joins the users and employees table and get the data corresponding the user -- purpose: determine if the user is a manager 
        const sqlQueryOne =  `SELECT users.password, users.employeeid, users.customerid, employee.supervisorid FROM users LEFT JOIN employee ON users.EmployeeId = employee.EmployeeID WHERE users.UserID = ?`
        const [rows] = await connection.query(
           sqlQueryOne, 
            [UserID]
        );

        //Release the DB connection
        connection.release(); 

        //If no user was found with the given name throw err 
        if (rows.length === 0) {
            return res.status(401).json({ error: "Wrong Credentials" });
        }

        //Compare the password with the hashed password. If wrong throw err
        if (!(await bcrypt.compare(Password, rows[0].password))) {
            return res.status(401).json({ error: "Wrong Credentials" });
        }

        //Contents of the JWT -- purpose: allows us to create protected routes by checking the JWT payload
        const user = {
            UserID: UserID,
            EmployeeID: rows[0].employeeid,
            CustomerID: rows[0].customerid,
            SupervisorID: rows[0].supervisorid 
        };
        
        //Creates the JWT token with an expiration time of one hour -- purpose: compromised JWT won't be alive forever
        const accessToken = jwt.sign(user, process.env.Secret_Key, { expiresIn: '1h' });

        //Return the JWT token
        res.json({ accessToken });

    } catch (error) {
        //Catch error and print message
        console.log(error.message)
        res.status(500).json({ error: error.message});
    }
};

//Authentication of JWT 
function authenticateToken(req, res, next) {
    //JWT is stored in authentication header 
    const authHeader = req.headers['authorization'];

    //Check if there is an authentication header if so you need to extract it
    const token = authHeader && authHeader.split(' ')[1];

    //If JWT is not there
    if (token == null){
        console.log("no token here")
        return res.status(401).json({ error: 'No token' });
    } 

    //The JWT is verified with enviornment variable secret -- purpose: keeps secret out of source code
    jwt.verify(token, process.env.Secret_Key, (err, user) => {
        //If token is altered or expired 
        if (err) {
            console.log(err.message)
            return res.status(401).json({ error: 'Forbidden: Invalid token' });
            
        }

        //Create new request object and pass on to next middleware
        req.user = user;
        next();
    });
    
    
}

//Authorize Employees both Manager and Employee
function authorizeEmployee(req, res, next){
    if (req.user.EmployeeID!=null){
        next();
    }else{
        return res.status(403).json({error:"not authorized as employee"})
    }
}

//Authorize Standard Employees
function authorizeRegularEmployee(req, res, next){
    if (req.user.EmployeeID!=null && req.user.SupervisorID!=null){
        next();
    }else{
        return res.status(403).json({error:"not authorized as standard employee"})
    }
}

//Authorize Customer
function authorizeCustomer(req, res, next){
    if (req.user.CustomerID!=null){
        next();
    }else{
        return res.status(403).json({error:"not authorized as customer"})
    }
}

//Authorize Manager
function authorizeManager(req,res,next){
    console.log(req.user.EmployeeID, req.user.SupervisorID)
    if(req.user.EmployeeID != null && req.user.SupervisorID == null){
        next();
    }else{
        return res.status(403).json({error:"not authorized as manager"})
    }

}

//Check if the UserID is taken
function userNameExists(UserID){
    pool.query('Select * From users Where UserID = ?', [UserID], (err, results) => {
        if (err || results.length != 0) {
            return true;
        }
        return false
    });
}

//Check if CustomerID is taken
function customerIDExists(CustomerID){
    pool.query('Select * From users Where CustomerID = ?', [CustomerID], (err, results) => {
        if (err || results.length != 0) {
            return true;
        }
        return false
    });
}

//Check if Employee exists
function employeeIDExists(EmployeeID){
    pool.query('Select * From users Where EmployeeID = ?', [EmployeeID], (err, results) => {
        if (err || results.length != 0) {
            return true;
        }
        return false
    });
}

//Checks Signup format
function signUpFormat(req,res,next){
    req.body.UserID = req.body.UserID.trim()
    req.body.Password =  req.body.Password.trim()
    req.body.UserNameFirst = req.body.UserNameFirst.trim().toLowerCase()
    req.body.UserNameLast = req.body.UserNameLast.trim().toLowerCase()
    req.body.UserPhoneNumber = req.body.UserPhoneNumber.trim()
    const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    if (!UserID || UserID.length < 5){
        res.status(400).json({error:"UserID too short"})
        return;
    }

    if(!Password || Password.length<7){
        res.status(400).json({error:"Password too short"})
        return;
    }

    if(!UserNameFirst || UserNameFirst == 0){
        res.status(400).json({error:"First name too short"})
        return;
    }

    if(!UserNameLast || UserNameLast == 0){
        res.status(400).json({error:"Last name too short"})
        return;
    }

    const regex = /^\d{1}-\d{3}-\d{3}-\d{4}$/;

    if (!UserPhoneNumber || !regex.test(UserPhoneNumber)) {
        res.status(400).json({error:"Invalid Phone Number Format"})
        return;
    } 

    next()
}

//Chekcs signup format for employees
async function signUpFormatEmployee(req, res, next) {
    req.body.EmployeeHireDate = req.body.EmployeeHireDate.trim();
    req.body.EmployeeStatus = req.body.EmployeeStatus.trim();
    req.body.EmployeeBirthDate = req.body.EmployeeBirthDate.trim();
    req.body.EmployeeDepartment = req.body.EmployeeDepartment.trim();
    req.body.EmployeeHourly = req.body.EmployeeHourly;
    req.body.SupervisorID = req.body.SupervisorID.trim();

    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly,
        SupervisorID
    } = req.body;

    if (!EmployeeHireDate || isNaN(new Date(EmployeeHireDate).getTime())) {
        return res.status(400).json({ error: "Invalid Employee Hire Date" });
    }


    const validStatuses = ['Employed','Absence','Fired'];
    if (!EmployeeStatus || !validStatuses.includes(EmployeeStatus)) {
        return res.status(400).json({ error: "Employee Status must be one of three \'Employed\' , \'Absence\', \'Fired\'" });
    }

    const birthDate = new Date(EmployeeBirthDate);
    if (!EmployeeBirthDate || isNaN(birthDate.getTime())) {
        return res.status(400).json({ error: "Invalid Employee Birth Date" });
    }

  
    if (birthDate > new Date()) {
        return res.status(400).json({ error: "Employee Birth Date cannot be time traveler" });
    }


    if (!EmployeeDepartment || EmployeeDepartment.length < 3) {
        return res.status(400).json({ error: "Employee Department must be at least 3 characters long" });
    }


    if (typeof EmployeeHourly !== 'number') {
        return res.status(400).json({ error: "EmployeeHourly must be a valid number" });
    }


    if (!SupervisorID || SupervisorID.length < 1) {
        return res.status(400).json({ error: "Supervisor ID is required" });
    }

    const supervisorExists = await checkSupervisorExists(SupervisorID);
    if (!supervisorExists) {
        return res.status(400).json({ error: "Supervisor ID does not exist" });
    }

    next();
}

//Chekcs signup format for employees
async function signUpFormatManager(req, res, next) {
    req.body.EmployeeHireDate = req.body.EmployeeHireDate.trim();
    req.body.EmployeeStatus = req.body.EmployeeStatus.trim();
    req.body.EmployeeBirthDate = req.body.EmployeeBirthDate.trim();
    req.body.EmployeeDepartment = req.body.EmployeeDepartment.trim();
    req.body.EmployeeHourly = req.body.EmployeeHourly;
    req.body.SupervisorID = req.body.SupervisorID.trim();

    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly,
        SupervisorID
    } = req.body;

    if (!EmployeeHireDate || isNaN(new Date(EmployeeHireDate).getTime())) {
        return res.status(400).json({ error: "Invalid Employee Hire Date" });
    }


    const validStatuses = ['Employed','Absence','Fired'];
    if (!EmployeeStatus || !validStatuses.includes(EmployeeStatus)) {
        return res.status(400).json({ error: "Employee Status must be one of three \'Employed\' , \'Absence\', \'Fired\'" });
    }

    const birthDate = new Date(EmployeeBirthDate);
    if (!EmployeeBirthDate || isNaN(birthDate.getTime())) {
        return res.status(400).json({ error: "Invalid Employee Birth Date" });
    }

  
    if (birthDate > new Date()) {
        return res.status(400).json({ error: "Employee Birth Date cannot be time traveler" });
    }


    if (!EmployeeDepartment || EmployeeDepartment.length < 3) {
        return res.status(400).json({ error: "Employee Department must be at least 3 characters long" });
    }


    if (typeof EmployeeHourly !== 'number') {
        return res.status(400).json({ error: "EmployeeHourly must be a valid number" });
    }

    next();
}

//Checks for valid employee
async function checkSupervisorExists(SupervisorID) {
    try {
        const [results] = await pool.promise().query('SELECT * FROM employee WHERE EmployeeID = ?', [SupervisorID]);
        return results.length > 0;
    } catch (error) {
        console.error("Error checking supervisor:", error);
        return false;
    }
}

//Checks login format
function loginFormat(req,res,next){
    if (!req.body.UserID || typeof req.body.UserID != 'string' ){
        return res.status(400).json({error:"Username Not Found"})
    }
    if (!req.body.Password || typeof req.body.Password != 'string' ){
        return res.status(400).json({error:"Password Not Found"})
    }
    req.body.UserID = req.body.UserID.trim()
    req.body.Password = req.body.Password.trim()
    if (req.body.UserID.length < 5){
        return res.status(400).json({error:"Username username"})
    }
    if (req.body.Password.length < 7){
        return res.status(400).json({error:"Password Too Short"})
    }
    next();
}



module.exports = {login, signUpCustomer, userNameExists, authenticateToken, signUpFormat, loginFormat, authorizeCustomer, authorizeManager, authorizeRegularEmployee, authorizeEmployee, signUpEmployee, signUpFormatEmployee, signUpManager, signUpFormatManager}