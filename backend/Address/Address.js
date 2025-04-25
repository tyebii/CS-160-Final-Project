const express = require('express')

const {getAddress, addAddress, deleteAddress} = require('./AddressController')

const router = express.Router()

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeCustomer} = require('../Utils/Authorization')

const rateLimit = require('express-rate-limit');

//Rate Limiter For Address
const addressLimiter = rateLimit({

    windowMs: 60 * 1000 * 2, 

    max: 20, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(addressLimiter)

router.use(express.json());

router.use([authenticateToken, authorizeCustomer])

//Get The Customer's Addresses
router.get('/address', getAddress);

//Adds An Address
router.post('/address', addAddress);

//Deletes An Address
router.delete('/address/:address', deleteAddress);

module.exports = router
