const express = require('express')
const router = express.Router()
const {getCustomer} = require('./CustomerController')
const { authenticateToken, authorizeCustomer} = require('../Auth/AuthenticationController')
router.use(express.json());

router.get('/customer', authenticateToken, authorizeCustomer, getCustomer)


module.exports = router 