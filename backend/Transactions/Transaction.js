const express = require('express')
const router = express.Router()
const {getTransactionID, getCurrentTransactions, getCustomerTransactions} = require('./TransactionController')
const { authenticateToken, authorizeEmployee, authorizeCustomer, authorizeManager} = require('../Auth/AuthenticationController')
router.use(express.json());

router.get('/transactions/pending', authenticateToken, authorizeEmployee, getCurrentTransactions)

router.post('/transactions/id', authenticateToken, authorizeManager, getTransactionID)

router.get('/transactions/customer', authenticateToken, authorizeCustomer, getCustomerTransactions)

module.exports = router