const express = require('express')
const { authenticateToken, authorizeManager} = require('../Auth/AuthenticationController')
const {getEmployee, getEmployeeID, deleteEmployee, updateEmployee} = require('./EmployeeController')
const {signUpFormatEmployee} = require('../Auth/AuthenticationController')
const router = express.Router()
router.use(express.json());

router.get('/employee', authenticateToken, authorizeManager, getEmployee)

router.get('/employee/id', authenticateToken, authorizeManager, getEmployeeID)

router.put('/employee', authenticateToken, authorizeManager, signUpFormatEmployee, updateEmployee)

router.delete('/employee',  authenticateToken, authorizeManager, deleteEmployee)

module.exports = router