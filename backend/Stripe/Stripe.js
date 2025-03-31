const express = require('express')
const router = express.Router()
const {handleStripe} = require('./StripeController')
const { authenticateToken, authorizeCustomer } = require('../Auth/AuthenticationController')

router.post("/create-checkout-session", authenticateToken, authorizeCustomer, handleStripe)



module.exports = router;
