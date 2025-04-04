const express = require('express')
const router = express.Router()
const {getTransactionID, getCurrentTransactions, getCustomerTransactions} = require('./TransactionController')
const { authenticateToken, authorizeEmployee, authorizeCustomer} = require('../Auth/AuthenticationController')
router.use(express.json());

router.get('/transactions/pending', authenticateToken, authorizeEmployee, getCurrentTransactions)

router.get('/transactions/id', authenticateToken, authorizeEmployee, getTransactionID)

router.get('/transactions/customer', authenticateToken, authorizeCustomer, getCustomerTransactions)

module.exports = router