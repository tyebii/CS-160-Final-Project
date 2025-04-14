const express = require('express')

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeManager} = require('../Utils/Authorization')

const {signUpFormatEmployee} = require('../Utils/Formatting')


const {getEmployee, getEmployeeID, deleteEmployee, updateEmployee} = require('./EmployeeController')

const {employeeFormat} = require('../Utils/Formatting')

const router = express.Router()

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