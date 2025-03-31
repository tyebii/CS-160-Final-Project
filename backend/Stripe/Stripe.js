const express = require('express')
const router = express.Router()
const {handleStripe} = require('./StripeController')


router.post("/create-checkout-session", handleStripe)

module.exports = router;
