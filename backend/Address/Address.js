//Import Express
const express = require('express')

//Authentication and Authorization
const { authenticateToken, authorizeCustomer } = require('../Auth/AuthenticationController')

//Address Controllers
const {getAddress, addAddress, deleteAddress, formatAddress} = require('./AddressController')

//For Modularity
const router = express.Router()

//Json Parsing on all links
router.use(express.json());

//Apply Authentication and Authorization on each route
router.use([authenticateToken, authorizeCustomer])

//Fetch User's Addresses
router.get('/address',  getAddress);

//Add Address
router.post('/address',  formatAddress, addAddress);

//Delete Address
router.delete('/address', deleteAddress);

//Export to main
module.exports = router
