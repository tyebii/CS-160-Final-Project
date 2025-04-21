const express = require('express');

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeManager} = require('../Utils/Authorization')

const {loginFormat, signUpFormat, signUpFormatManager, signUpFormatEmployee} = require('../Utils/Formatting')

const {login, signUpCustomer, signUpEmployee, signUpManager} = require('./AuthenticationController')

const router = express.Router();

router.use(express.json()); 

//Signup Customer
router.post('/signup/customer', signUpFormat,  signUpCustomer);

//Signup Employee
router.post('/signup/employee', authenticateToken, authorizeManager, signUpFormat, signUpFormatEmployee, signUpEmployee);

//Signup Manager
router.post('/signup/manager', signUpFormat, signUpFormatManager, signUpManager)

//Login
router.post('/login', loginFormat, login)

module.exports = router;
