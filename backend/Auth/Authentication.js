//Import Express
const express = require('express');

//Import Functions From The Controller
const {login, signUpFormatManager, signUpCustomer, authenticateToken, signUpFormat, loginFormat, authorizeManager, signUpEmployee, signUpFormatEmployee, signUpManager} = require('./AuthenticationController')

//Router to make backend modular
const router = express.Router();

//JSON Parser On Each Route
router.use(express.json()); 

//Signs Up Customers
router.post('/signup/customer', signUpFormat,  signUpCustomer);

//Signs Up Employees
router.post('/signup/employee', authenticateToken, authorizeManager, signUpFormat, signUpFormatEmployee, signUpEmployee);

//Signs Up Managers
router.post('/signup/manager', signUpFormat, signUpFormatManager, signUpManager)

//Login 
router.post('/login', loginFormat, login)

//Export the router
module.exports = router;
