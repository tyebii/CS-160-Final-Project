const express = require('express')
const { authenticateToken, authorizeCustomer } = require('../Auth/AuthenticationController')
const {getAddress, addAddress, deleteAddress, formatAddress} = require('./AddressController')
const router = express.Router()
router.use(express.json());

router.use([authenticateToken, authorizeCustomer])

router.get('/address',  getAddress);

router.post('/address',  formatAddress, addAddress);

router.delete('/address', deleteAddress);

module.exports = router
