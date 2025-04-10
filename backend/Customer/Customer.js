//Import express
const express = require('express')

//Import router for modularity
const router = express.Router()

//getCustomer controller
const {getCustomer, getEmployee} = require('./CustomerController')

//Apply authentication and authorization on the routes
const { authenticateToken, authorizeCustomer, authorizeEmployee} = require('../Auth/AuthenticationController')

//Apply json parsing on routes
router.use(express.json());

//Gets the customers information
router.get('/customer', authenticateToken, authorizeCustomer, getCustomer)

//Gets the employees information
router.get('/employee', authenticateToken, authorizeEmployee, getEmployee)

module.exports = router 