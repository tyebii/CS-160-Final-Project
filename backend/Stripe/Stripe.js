const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const {handleStripe, addTransaction, handleHook} = require('./StripeController')

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeCustomer} = require('../Utils/Authorization')

//Gets Information From Webhook
router.post("/webhook", bodyParser.raw({ type: 'application/json' }), handleHook);

//Creates Stripe Session
router.post("/create-checkout-session", express.json(), authenticateToken, authorizeCustomer, addTransaction, handleStripe)



//stripe listen --forward-to localhost:3301/api/stripe/webhook

module.exports = router;
