//Import the UUID 
const { v4: uuidv4 } = require('uuid');

//Import Bcrypt 
const bcrypt = require('bcrypt')

//Import JWT
const jwt = require('jsonwebtoken'); 

//Import ENV reader
require('dotenv').config(); 

//Import Database connections
const pool = require('../Database Pool/DBConnections');
const { response } = require('express');


//--------------------------------Core Controllers------------------------------//
//Signs Up Customers
const signUpCustomer = async (req, res) => {

        //DB connection to start a transactions
        let connection;
    
        try {
            //Deconstructing payload
            const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

            //Make sure we wait for the username to be checked
            try{
                const notUnique = await userNameExists(UserID);
                if(notUnique){
                    res.status(409).json({error:"The Username is Already Taken"})
                }
            }catch(error){
                return res.status(500).json({error:"Internal Server Error While Querying For Unique Username: " + error})
            }

            // Hashed Password
            let salt;
            let hashedPassword;
            try{
                salt = await bcrypt.genSalt(10); // Generates the salt -- purpose: can't use list of precomputed hashes
                hashedPassword = await bcrypt.hash(Password, salt); //Generates the hash based on round factor of salt
            }catch(error){
                return res.status(500).json({error:"Error During Storage of Password"})
            }

            // Unique ID generation
            let CustomerID = uuidv4(); // Generates a cryptographically safe unique customer ID
            let flag = true;
            let count = 0
            const limit = 5
            while (flag) {
                if(count === limit){
                    return res.status(500).json({error:"Trouble Generating CustomerID"})
                }
                count+=1 
                try {
                    // Check if customer ID exists
                    const exists = await customerIDExists(CustomerID);
                    
                    if (exists) {
                        CustomerID = uuidv4(); 
                    } else {
                        flag = false;
                    }
                } catch (error) {
                    CustomerID = uuidv4(); 
                }
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
        } catch (error) {
            //If error occurred prior to connection release
            if (connection) {
                //Rollback the database to state prior to transaction
                await connection.rollback();
                //Release connection
                connection.release();
            }
            
            //Return error and error message
            res.status(500).json({ error: error.message });
        }
};

//Signup Employees
const signUpEmployee = async (req, res) => {
        //DB connection
        let connection;
    
        try {
            //Deconstructing payload
            const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID} = req.body;
            
            //Make sure we wait for the username to be checked
            try{
                const notUnique = await userNameExists(UserID);
                if(notUnique){
                    res.status(409).json({error:"The Username is Already Taken"})
                }
            }catch(error){
                return res.status(500).json({error:"Internal Server Error While Querying For Unique Username: " + error})
            }

            // Hashed Password
            let salt;
            let hashedPassword;
            try{
                salt = await bcrypt.genSalt(10); // Generates the salt -- purpose: can't use list of precomputed hashes
                hashedPassword = await bcrypt.hash(Password, salt); //Generates the hash based on round factor of salt
            }catch(error){
                return res.status(500).json({error:"Error During Storage of Password"})
            }

            // Unique ID generation
            let EmployeeID = uuidv4(); // Generates a cryptographically safe unique customer ID
            let flag = true;
            let count = 0
            const limit = 5
            while (flag) {
                //Its statistically significant to keep getting collisions so 5 is the limit
                if(count === limit){
                    return res.status(500).json({error:"Trouble Generating EmployeeID"})
                }
                count+=1 
                try {
                    // Check if customer ID exists
                    const exists = await employeeIDExists(EmployeeID);
                    
                    if (exists) {
                        EmployeeID = uuidv4(); 
                    } else {
                        flag = false;
                    }
                } catch (error) {
                    EmployeeID = uuidv4(); 
                }
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
        } catch (error) {
            //If error occurred prior to connection release
            if (connection) {
                //Rollback the database to state prior to transaction
                await connection.rollback();
                //Release connection
                connection.release();
            }
            
            //Return error and error message
            res.status(500).json({ error: error.message });
        }
}

//Signup Employees
const signUpManager = async (req, res) => {
    //DB connection
    let connection;

    try {
        //Deconstructing payload
        const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, Secret} = req.body;
        
        if(Secret!=process.env.Secret){
            return res.status(401).json({error:"Not Authorized"})
        }

        //Make sure we wait for the username to be checked
        try{
            const notUnique = await userNameExists(UserID);
            if(notUnique){
                res.status(409).json({error:"The Username is Already Taken"})
            }
        }catch(error){
            return res.status(500).json({error:"Internal Server Error While Querying For Unique Username: " + error})
        }


        // Hashed Password
        let salt;
        let hashedPassword;
        try{
            salt = await bcrypt.genSalt(10); // Generates the salt -- purpose: can't use list of precomputed hashes
            hashedPassword = await bcrypt.hash(Password, salt); //Generates the hash based on round factor of salt
        }catch(error){
            return res.status(500).json({error:"Error During Storage of Password"})
        }

        // Unique ID generation
        let EmployeeID = uuidv4(); // Generates a cryptographically safe unique customer ID
        let flag = true;
        let count = 0
        const limit = 5
        while (flag) {
            //Its statistically significant to keep getting collisions so 5 is the limit
            if(count === limit){
                return res.status(500).json({error:"Trouble Generating EmployeeID"})
            }
            count+=1 
            try {
                // Check if customer ID exists
                const exists = await employeeIDExists(EmployeeID);
                
                if (exists) {
                    EmployeeID = uuidv4(); 
                } else {
                    flag = false;
                }
            } catch (error) {
                EmployeeID = uuidv4(); 
            }
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
    } catch (error) {
        //If error occurred prior to connection release
        if (connection) {
            //Rollback the database to state prior to transaction
            await connection.rollback();
            //Release connection
            connection.release();
        }
        
        //Return error and error message
        res.status(500).json({ error: error.message });
    }
}

//Logs in customers and employees 
const login = async (req, res) => {
    try {
        //Data in the payload
        const {UserID, Password} = req.body;

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

        try{
            //Compare the password with the hashed password. If wrong throw err
            if (!(await bcrypt.compare(Password, rows[0].password))) {
                return res.status(401).json({ error: "Wrong Credentials" });
            }
        }catch(error){
            return res.status(500).json({error:"Issue With Bcrypt Compare"})
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
        return res.status(200).json({ accessToken });

    } catch (error) {
        //If error occurred prior to connection release
        if (connection) {
            //Rollback the database to state prior to transaction
            await connection.rollback();
            //Release connection
            connection.release();
        }
        //Catch error and print message
        res.status(500).json({ error: error.message});
    }
};


//----------------------------------------Authentication and Authorization------------------------------------//
//Authentication of JWT 
function authenticateToken(req, res, next) {
    //JWT is stored in authentication header 
    const authHeader = req.headers['authorization'];

    //Check if there is an authentication header if so you need to extract it
    const token = authHeader && authHeader.split(' ')[1];

    //If JWT is not there
    if (token == null){
        return res.status(401).json({ error: 'No Token' });
    } 

    //The JWT is verified with enviornment variable secret -- purpose: keeps secret out of source code
    jwt.verify(token, process.env.Secret_Key, (error, user) => {
        //If token is altered or expired 
        if (error) {
            return res.status(401).json({ error: 'Invalid token' });
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
    if(req.user.EmployeeID != null && req.user.SupervisorID == null){
        next();
    }else{
        return res.status(403).json({error:"not authorized as manager"})
    }

}

//----------------------------------------------Duplicate Checks------------------------------------//

async function userNameExists(UserID) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE UserID = ?', [UserID], (error, results) => {
            if (error) {
                reject(error); 
            } else {
                resolve(results.length !== 0); 
            }
        });
    });
}


//Check if CustomerID is taken
async function customerIDExists(CustomerID){
    return new Promise((resolve,reject)=>{
        pool.query('Select * From users Where CustomerID = ?', [CustomerID], (error, results) => {
            if (error) {
                reject(error)
            }else{
                resolve(results.length !== 0)
            }
        });
    })
}

//Check if Employee exists
async function employeeIDExists(EmployeeID){
    return new Promise((resolve,reject)=>{
        pool.query('Select * From users Where EmployeeID = ?', [EmployeeID], (error, results) => {
            if (error) {
                reject(error)
            }else{
                resolve(results.length!==0)
            }
            
        });
    })
}

//Checks for valid employee
async function checkSupervisorExists(SupervisorID) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employee WHERE EmployeeID = ? and SupervisorID is null', [SupervisorID], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0);
            }
        });
    });
}



//---------------Formatting-------------------//

//Checks Signup format
function signUpFormat(req, res, next) {
    req.body.UserID = req.body.UserID.toLowerCase();
    req.body.Password = req.body.Password;
    req.body.UserNameFirst = req.body.UserNameFirst;
    req.body.UserNameLast = req.body.UserNameLast;
    req.body.UserPhoneNumber = req.body.UserPhoneNumber;

    const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    if (!UserID) {
        return res.status(500).json({ error: "Please Fill In User ID" });
    }

    if (!UserNameFirst) {
        return res.status(500).json({ error: "Please Fill In First Name" });
    }

    if (!UserNameLast) {
        return res.status(500).json({ error: "Please Fill In Last Name" });
    }

    if (!UserPhoneNumber) {
        return res.status(500).json({ error: "Please Fill In Phone Number" });
    }

    if (!Password) {
        return res.status(500).json({ error: "Please Fill In Password" });
    }

    if (typeof UserID !== "string") {
        return res.status(500).json({ error: "User ID Must Be A String" });
    }

    if (typeof Password !== "string") {
        return res.status(500).json({ error: "Password Must Be A String" });
    }

    if (typeof UserNameFirst !== "string") {
        return res.status(500).json({ error: "First Name Must Be A String" });
    }

    if (typeof UserNameLast !== "string") {
        return res.status(500).json({ error: "Last Name Must Be A String" });
    }

    if (typeof UserPhoneNumber !== "string") {
        return res.status(500).json({ error: "Phone Number Must Be A String" });
    }

    if (UserID.trim().length < 5) {
        return res.status(500).json({ error: "User ID Must Be At Least 5 Characters Long" });
    }

    if (UserID.length > 255) {
        return res.status(500).json({ error: "User ID Must Be Less Than or Equal To 255 Characters Long" });
    }

    if (UserNameFirst.trim().length < 2) {
        return res.status(500).json({ error: "First Name Must Be At Least 2 Characters Long" });
    }

    if (UserNameFirst.length > 255) {
        return res.status(500).json({ error: "First Name Must Be Less Than or Equal To 255 Characters Long" });
    }

    if (UserNameLast.trim().length < 2) {
        return res.status(500).json({ error: "Last Name Must Be At Least 2 Characters Long" });
    }

    if (UserNameLast.length > 255) {
        return res.status(500).json({ error: "Last Name Must Be Less Than or Equal To 255 Characters Long" });
    }

    if (hasSpaces(UserID)) {
        return res.status(500).json({ error: "User ID Must Not Contain Spaces" });
    }

    if (hasSpaces(Password)) {
        return res.status(500).json({ error: "Password Must Not Contain Spaces" });
    }

    if (hasSpaces(UserNameFirst)) {
        return res.status(500).json({ error: "First Name Must Not Contain Spaces" });
    }

    if (hasSpaces(UserNameLast)) {
        return res.status(500).json({ error: "Last Name Must Not Contain Spaces" });
    }

    if (hasSpaces(UserPhoneNumber)) {
        return res.status(500).json({ error: "Phone Number Must Not Contain Spaces" });
    }

    const regexNumber = /^1-\d{3}-\d{3}-\d{4}$/;

    if (!UserPhoneNumber.match(regexNumber)) {
        return res.status(500).json({ error: "Phone Number Must Be In The Format 1-XXX-XXX-XXXX" });
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!Password.match(regexPassword)) {
        return res.status(500).json({
            error: "Password Must Be At Least 8 Characters Long, Contain At Least One Uppercase Letter, One Lowercase Letter, One Number, And One Special Character"
        });
    }
    next();
}


// Helper function to validate date format
function isValidDate(input) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(input)) return false;

    const date = new Date(input);
    const timestamp = date.getTime();
    if (isNaN(timestamp)) return false;

    return input === date.toISOString().slice(0, 10);
}

// Helper function to check spaces
const hasSpaces = (input) => /\s/.test(input);

// Checks signup format for employees
async function signUpFormatEmployee(req, res, next) {
    req.body.EmployeeHireDate = req.body.EmployeeHireDate;
    req.body.EmployeeStatus = req.body.EmployeeStatus;
    req.body.EmployeeBirthDate = req.body.EmployeeBirthDate;
    req.body.EmployeeDepartment = req.body.EmployeeDepartment;
    req.body.EmployeeHourly = req.body.EmployeeHourly;
    req.body.SupervisorID = req.body.SupervisorID;

    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly,
        SupervisorID
    } = req.body;

    // Validate required fields
    if (EmployeeHireDate == null || EmployeeHireDate === "") {
        return res.status(400).json({ error: "Please Fill In Hire Date" });
    }

    if (EmployeeStatus == null || EmployeeStatus === "") {
        return res.status(400).json({ error: "Please Fill In Employee Status" });
    }

    if (EmployeeBirthDate == null || EmployeeBirthDate === "") {
        return res.status(400).json({ error: "Please Fill In Birth Date" });
    }

    if (EmployeeDepartment == null || EmployeeDepartment === "") {
        return res.status(400).json({ error: "Please Fill In Department" });
    }

    if (EmployeeHourly === 0 || EmployeeHourly == null) {
        return res.status(400).json({ error: "Please Fill In Hourly Wage" });
    }

    if (SupervisorID == null || SupervisorID === "") {
        return res.status(400).json({ error: "Supervisor ID Must Be Filled In" });
    }

    // Check that Hire Date is in the past or present
    if (new Date(EmployeeHireDate) > new Date()) {
        return res.status(400).json({ error: "Hire Date Must Be In The Past or Present" });
    }

    // Validate Employee Status
    const validStatuses = ["Employed", "Absence", "Fired"];
    if (!validStatuses.includes(EmployeeStatus)) {
        return res.status(400).json({ error: "Invalid Employee Status" });
    }

    // Check if Birth Date is a valid date and in the past
    if (!isValidDate(EmployeeBirthDate)) {
        return res.status(400).json({ error: "Birth Date Must Be A Valid Date" });
    }

    if (new Date(EmployeeBirthDate) > new Date()) {
        return res.status(400).json({ error: "Birth Date Must Be In The Past" });
    }

    // Validate Department length
    if (EmployeeDepartment.trim().length < 2) {
        return res.status(400).json({ error: "Department Must Be At Least 2 Characters Long" });
    }

    if (EmployeeDepartment.trim().length > 255) {
        return res.status(400).json({ error: "Department Must Be Less Than or Equal To 255 Characters Long" });
    }

    // Validate Hourly Wage
    if (EmployeeHourly <= 0) {
        return res.status(400).json({ error: "Hourly Wage Must Be Greater Than 0" });
    }

    // Validate Supervisor ID length
    if (SupervisorID.length < 5) {
        return res.status(400).json({ error: "Supervisor ID Must Be At Least 5 Characters Long" });
    }

    if (SupervisorID.length > 255) {
        return res.status(400).json({ error: "Supervisor ID Must Be Less Than or Equal To 255 Characters Long" });
    }

    // Check for spaces in the input fields
    if (hasSpaces(EmployeeHireDate)) {
        return res.status(400).json({ error: "Hire Date Must Not Contain Spaces" });
    }

    if (hasSpaces(EmployeeStatus)) {
        return res.status(400).json({ error: "Employee Status Must Not Contain Spaces" });
    }

    if (hasSpaces(EmployeeBirthDate)) {
        return res.status(400).json({ error: "Birth Date Must Not Contain Spaces" });
    }

    if (hasSpaces(EmployeeDepartment)) {
        return res.status(400).json({ error: "Department Must Not Contain Spaces" });
    }

    if (hasSpaces(SupervisorID)) {
        return res.status(400).json({ error: "Supervisor ID Must Not Contain Spaces" });
    }

    // Check if Supervisor ID exists in the database
    try {
        const notFailed = await checkSupervisorExists(SupervisorID);
        if (!notFailed) {
            return res.status(500).json({ error: "Supervisor ID does not exist" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Issue with database: " + error });
    }

    next();
}

//Chekcs signup format for employees
async function signUpFormatManager(req, res, next) {
    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly,
        Secret
    } = req.body;

    // Validate required fields
    if (Secret ==  null){
        return res.status(401).json({ error: "Not Authorized" });
    }

    if (EmployeeHireDate == null || EmployeeHireDate === "") {
        return res.status(400).json({ error: "Please Fill In Hire Date" });
    }

    if (EmployeeStatus == null || EmployeeStatus === "") {
        return res.status(400).json({ error: "Please Fill In Employee Status" });
    }

    if (EmployeeBirthDate == null || EmployeeBirthDate === "") {
        return res.status(400).json({ error: "Please Fill In Birth Date" });
    }

    if (EmployeeDepartment == null || EmployeeDepartment === "") {
        return res.status(400).json({ error: "Please Fill In Department" });
    }

    if (EmployeeHourly === 0 || EmployeeHourly == null) {
        return res.status(400).json({ error: "Please Fill In Hourly Wage" });
    }

    // Check that Hire Date is in the past or present
    if (new Date(EmployeeHireDate) > new Date()) {
        return res.status(400).json({ error: "Hire Date Must Be In The Past or Present" });
    }

    // Validate Employee Status
    const validStatuses = ["Employed", "Absence", "Fired"];
    if (!validStatuses.includes(EmployeeStatus)) {
        return res.status(400).json({ error: "Invalid Employee Status" });
    }

    // Check if Birth Date is a valid date and in the past
    if (!isValidDate(EmployeeBirthDate)) {
        return res.status(400).json({ error: "Birth Date Must Be A Valid Date" });
    }

    if (new Date(EmployeeBirthDate) > new Date()) {
        return res.status(400).json({ error: "Birth Date Must Be In The Past" });
    }

    // Validate Department length
    if (EmployeeDepartment.trim().length < 2) {
        return res.status(400).json({ error: "Department Must Be At Least 2 Characters Long" });
    }

    if (EmployeeDepartment.trim().length > 255) {
        return res.status(400).json({ error: "Department Must Be Less Than or Equal To 255 Characters Long" });
    }

    // Validate Hourly Wage
    if (EmployeeHourly <= 0) {
        return res.status(400).json({ error: "Hourly Wage Must Be Greater Than 0" });
    }

    // Check for spaces in the input fields
    if (hasSpaces(EmployeeHireDate)) {
        return res.status(400).json({ error: "Hire Date Must Not Contain Spaces" });
    }

    if (hasSpaces(EmployeeStatus)) {
        return res.status(400).json({ error: "Employee Status Must Not Contain Spaces" });
    }

    if (hasSpaces(EmployeeBirthDate)) {
        return res.status(400).json({ error: "Birth Date Must Not Contain Spaces" });
    }

    if (hasSpaces(EmployeeDepartment)) {
        return res.status(400).json({ error: "Department Must Not Contain Spaces" });
    }

    next();
}

//Checks login format
function loginFormat(req,res,next){
    if (!req.body.UserID || typeof req.body.UserID != 'string' ){
        return res.status(400).json({error:"Username Not Found"})
    }
    if (!req.body.Password || typeof req.body.Password != 'string' ){
        return res.status(400).json({error:"Password Not Found"})
    }

    if (req.body.UserID.length < 5){
        return res.status(400).json({error:"Username Not Found"})
    }
    if (req.body.Password.length < 7){
        return res.status(400).json({error:"Password Not Found"})
    }
    next();
}



module.exports = {login, signUpCustomer, userNameExists, authenticateToken, signUpFormat, loginFormat, authorizeCustomer, authorizeManager, authorizeRegularEmployee, authorizeEmployee, signUpEmployee, signUpFormatEmployee, signUpManager, signUpFormatManager}