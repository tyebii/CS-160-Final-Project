const express = require('express')

const router = express.Router()

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeCustomer, authorizeEmployee} = require('../Utils/Authorization')

const {getCustomer, getEmployee, updateCustomer, deleteCustomer} = require('./AccountInfoController')

router.use(express.json());

//Gets The Customer's Information
router.get('/customer', authenticateToken, authorizeCustomer, getCustomer)

//Gets The Employee's Information
router.get('/employee', authenticateToken, authorizeEmployee, getEmployee)

//Updates The Customers Account Details
//router.put('/customer', authenticateToken, authorizeCustomer, updateCustomer)

//Delete The Customers Account
router.delete('/customer', authenticateToken, authorizeCustomer, deleteCustomer)

module.exports = router 