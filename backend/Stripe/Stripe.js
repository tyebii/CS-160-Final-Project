const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const {handleStripe, addTransaction, handleHook} = require('./StripeController')
const { authenticateToken, authorizeCustomer } = require('../Auth/AuthenticationController')

router.post("/webhook", bodyParser.raw({ type: 'application/json' }), handleHook);

router.post("/create-checkout-session", express.json(), authenticateToken, authorizeCustomer, addTransaction, handleStripe)




module.exports = router;
