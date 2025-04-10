//Import Express
const express = require('express')

//Import Authentication and Authorization
const { authenticateToken, authorizeManager} = require('../Auth/AuthenticationController')

//Controllers
const {getEmployee, getEmployeeID, deleteEmployee, appendEmployee, EmployeeFormat} = require('./EmployeeController')

//Formatting
const {signUpFormatEmployee} = require('../Auth/AuthenticationController')

//Router for modularity
const router = express.Router()

//Parsing on each route
router.use(express.json());

//Get list of employees
router.get('/employee/supervisor', authenticateToken, authorizeManager, getEmployee)

//Get employee by their id 
router.get('/employee/id', authenticateToken, authorizeManager, getEmployeeID)

//Update employee
router.put('/employee', authenticateToken, authorizeManager, EmployeeFormat, signUpFormatEmployee, appendEmployee)

//Delete Employee
router.delete('/employee',  authenticateToken, authorizeManager, deleteEmployee)

module.exports = router