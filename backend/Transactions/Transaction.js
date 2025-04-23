const express = require('express')

const router = express.Router()

const {getTransactionID, getCurrentTransactions, getCustomerTransactions, fullfillOrder} = require('./TransactionController')

const {authorizeEmployee, authorizeCustomer, authorizeManager} = require('../Utils/Authorization')

const {authenticateToken} = require('../Utils/Authentication')

router.use(express.json());

//Get Pending Transactions
router.get('/transactions/pending', authenticateToken, authorizeEmployee, getCurrentTransactions)

//Get Transaction By ID
router.post('/transactions/id', authenticateToken, authorizeManager, getTransactionID)

//Customer's Transactions
router.get('/transactions/customer', authenticateToken, authorizeCustomer, getCustomerTransactions)

//Fulfill Order
router.post('/transactions/fulfill', authenticateToken, authorizeEmployee, fullfillOrder)

module.exports = router