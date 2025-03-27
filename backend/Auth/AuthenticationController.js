//Import the database connection pool
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 
const pool = require('../Database Pool/DBConnections')

const signUpCustomer = async (req, res) => {
        let connection;
    
        try {
            const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;
            

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);
    
            const CustomerID = uuidv4(); // Generate a unique customer ID
    
            // Get the connection from the pool
            connection = await pool.promise().getConnection(); // Use the promise wrapper to ensure async/await
    
            // Start a transaction
            await connection.beginTransaction();
    
            // Insert customer info
            await connection.query(
                'INSERT INTO customer (CustomerID, JoinDate) VALUES (?, ?)', 
                [CustomerID, new Date()]
            );
    
            // Insert user info
            await connection.query(
                'INSERT INTO users (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber, EmployeeID, CustomerID) VALUES (?, ?, ?, ?, ?, NULL, ?)', 
                [UserID, hashedPassword, UserNameFirst, UserNameLast, UserPhoneNumber, CustomerID]
            );
    
            // Commit the transaction
            await connection.commit();
    
            // Release the connection back to the pool
            connection.release();
    
            res.status(200).json({ success: true });
        } catch (err) {
            console.error("Error:", err.message);
    
            if (connection) {
                // Rollback if there's an error
                await connection.rollback();
                connection.release();
            }
    
            res.status(500).json({ error: "Internal Server Error" });
        }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const connection = await pool.promise().getConnection();

        const [rows] = await connection.query(
            `SELECT users.password, users.employeeid, users.customerid, employee.supervisorid 
             FROM users 
             LEFT JOIN employee ON users.EmployeeId = employee.EmployeeID 
             WHERE users.UserID = ?`, 
            [username]
        );

        connection.release(); 

        if (rows.length === 0) {
            return res.status(400).json({ error: "Invalid Username" });
        }


        if (!(await bcrypt.compare(password, rows[0].password))) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const user = {
            user: username,
            employee: rows[0].employeeid,
            customerid: rows[0].customerid,
            supervisorid: rows[0].supervisorid 
        };

        const accessToken = jwt.sign(user, process.env.Secret_Key, { expiresIn: '1h' });

        res.json({ accessToken });

    } catch (error) {
        console.error(error);  
        res.status(500).json({ error: "Internal Server Error" });
    }
};

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ error: 'No token provided' });
    jwt.verify(token, process.env.Secret_Key, (err, user) => {
        if (err) {
            res.status(403).json({ error: 'Forbidden: Invalid token' });
            return
        }
        req.user = user;
        next();
    });
    
}

function authorizeEmployee(req, res, next){
    if (!req.user.employeeid){
        return res.status(401).json({error:"not authorized as regular employee"})
    }
    next();
}

function authorizeRegularEmployee(req, res, next){
    if (!req.user.employeeid || req.user.supervisorid){
        return res.status(401).json({error:"not authorized as regular employee"})
    }
    next();
}

function authorizeCustomer(req, res, next){
    if (!req.user || !req.user.customerid){
        return res.status(401).json({error:"not authorized as customer"})
    }
    next();
}

function authorizeManager(req,res,next){
    if(!req.user.supervisorid){
        return res.status(401).json({error:"not authorized as manager"})
    }
    next();
}

function userNameExists(req, res, next){
    const {UserID} = req.body
    pool.query('Select * From users Where UserID = ?', [UserID], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }else if(results.length != 0){
            res.status(400).json({error: 'UserID Taken'})
            return
        }
        next();
    });
}


function signUpFormat(req,res,next){
    req.body.UserID = req.body.UserID.trim().toLowerCase()
    req.body.Password =  req.body.Password.trim()
    req.body.UserNameFirst = req.body.UserNameFirst.trim().toLowerCase()
    req.body.UserNameLast = req.body.UserNameLast.trim().toLowerCase()
    req.body.UserPhoneNumber = req.body.UserPhoneNumber.trim()
    const { UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    if (UserID.length < 5){
        res.status(400).json({error:"UserID too short"})
        return;
    }

    if(Password.length<7){
        res.status(400).json({error:"Password too short"})
        return;
    }

    if(UserNameFirst == 0){
        res.status(400).json({error:"First name too short"})
        return;
    }

    if(UserNameLast == 0){
        res.status(400).json({error:"Last name too short"})
        return;
    }

    const regex = /^\d{1}-\d{3}-\d{3}-\d{4}$/;

    if (!regex.test(UserPhoneNumber)) {
        res.status(400).json({error:"Invalid Phone Number Format"})
        return;
    } 

    next()
}


function loginFormat(req,res,next){
    req.body.username = req.body.username.trim()
    req.body.password = req.body.password.trim()
    if (req.body.username.length < 5){
        return res.status(400).json({error:"invalid username"})
    }
    if (req.body.password.length < 7){
        return res.status(400).json({error:"invalid username"})
    }
    next();
}



module.exports = {login, signUpCustomer, userNameExists, authenticateToken, signUpFormat, loginFormat, authorizeCustomer, authorizeManager, authorizeRegularEmployee, authorizeEmployee}