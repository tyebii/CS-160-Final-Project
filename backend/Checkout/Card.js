const express = require('express')
const { authenticateToken, authorizeCustomer } = require('../Auth/AuthenticationController')
const {getCreditCard, deleteCreditCard, addCreditCard} = require('./CardController')
const router = express.Router()

router.get('/creditcard', authenticateToken, authorizeCustomer, getCreditCard);

router.delete('/creditcard', authenticateToken, authorizeCustomer, deleteCreditCard);

router.post('/creditcard', authenticateToken, authorizeCustomer, addCreditCard)

module.exports = router