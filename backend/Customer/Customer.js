const express = require('express')
const router = express.Router()
const {getCustomer} = require('./CustomerController')
const { authenticateToken, authorizeCustomer} = require('../Auth/AuthenticationController')


router.get('/customer', authenticateToken, authorizeCustomer, getCustomer)


module.exports = router 