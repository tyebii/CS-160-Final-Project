const express = require('express')

const rateLimit = require('express-rate-limit');

const router = express.Router()

const {getTransactionID, getCurrentTransactions, getCustomerTransactions, fullfillOrder} = require('./TransactionController')

const {authorizeEmployee, authorizeCustomer, authorizeManager} = require('../Utils/Authorization')

const {authenticateToken} = require('../Utils/Authentication')

//Rate Limiter
const transactionLimiter = rateLimit({

    windowMs: 60 * 1000 * 5, 

    max: 50, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(transactionLimiter)

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