const express = require('express')
const router = express.Router()
const {getTransactionID, getCurrentTransactions} = require('./TransactionController')
const { authenticateToken, authorizeEmployee} = require('../Auth/AuthenticationController')

router.get('/transactions/pending', authenticateToken, authorizeEmployee, getCurrentTransactions)

router.get('/transactions/id', authenticateToken, authorizeEmployee, getTransactionID)

module.exports = router