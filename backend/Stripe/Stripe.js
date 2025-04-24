const express = require('express')

const rateLimit = require('express-rate-limit');

const router = express.Router()

const bodyParser = require('body-parser');

const {handleStripe, addTransaction, handleHook} = require('./StripeController')

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeCustomer} = require('../Utils/Authorization')

//Rate Limiter
const stripeLimiter = rateLimit({

    windowMs: 60 * 1000 * 10, 

    max: 10, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(stripeLimiter)

//Gets Information From Webhook
router.post("/webhook", bodyParser.raw({ type: 'application/json' }), handleHook);

//Creates Stripe Session
router.post("/create-checkout-session", express.json(), authenticateToken, authorizeCustomer, addTransaction, handleStripe)



//stripe listen --forward-to localhost:3301/api/stripe/webhook

module.exports = router;
