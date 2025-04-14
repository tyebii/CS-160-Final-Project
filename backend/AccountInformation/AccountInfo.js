const express = require('express')

const router = express.Router()

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeCustomer, authorizeEmployee} = require('../Utils/Authorization')

const {getCustomer, getEmployee} = require('./AccountInfoController')

router.use(express.json());

//Gets The Customer's Information
router.get('/customer', authenticateToken, authorizeCustomer, getCustomer)

//Gets The Employee's Information
router.get('/employee', authenticateToken, authorizeEmployee, getEmployee)

module.exports = router 