const express = require('express')

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeManager} = require('../Utils/Authorization')

const {signUpFormatEmployee} = require('../Utils/Formatting')

const {getEmployee, getEmployeeID, deleteEmployee, updateEmployee} = require('./EmployeeController')

const {employeeFormat} = require('../Utils/Formatting')

const rateLimit = require('express-rate-limit');

const router = express.Router()

//Rate Limiter
const employeeLimiter = rateLimit({

    windowMs: 60 * 1000 * 2, 

    max: 50, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(employeeLimiter)

router.use(express.json());

//Get list of employees
router.get('/employee/supervisor', authenticateToken, authorizeManager, getEmployee)

//Get employee by their id 
router.get('/employee/id', authenticateToken, authorizeManager, getEmployeeID)

//Update employee
router.put('/employee', authenticateToken, authorizeManager, employeeFormat, signUpFormatEmployee, updateEmployee)

//Delete Employee
router.delete('/employee',  authenticateToken, authorizeManager, deleteEmployee)

module.exports = router