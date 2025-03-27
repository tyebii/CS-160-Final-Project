const express = require('express')
const { authenticateToken, authorizeCustomer } = require('../Auth/AuthenticationController')
const {getAddress, addAddress, deleteAddress} = require('./AddressController')
const router = express.Router()

router.use([authenticateToken, authorizeCustomer])
router.get('/address',  getAddress);

router.post('/address',  addAddress);

router.delete('/address', deleteAddress);

module.exports = router
