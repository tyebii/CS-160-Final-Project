const express = require('express')

const {getAddress, addAddress, deleteAddress} = require('./AddressController')

const router = express.Router()

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeCustomer} = require('../Utils/Authorization')

router.use(express.json());

router.use([authenticateToken, authorizeCustomer])

//Get The Customer's Addresses
router.get('/address',  getAddress);

//Adds An Address
router.post('/address', addAddress);

//Deletes An Address
router.delete('/address', deleteAddress);

module.exports = router
