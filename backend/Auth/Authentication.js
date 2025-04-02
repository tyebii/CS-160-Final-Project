const express = require('express');
const {login, signUpFormatManager, signUpCustomer, authenticateToken, signUpFormat, loginFormat, authorizeManager, signUpEmployee, signUpFormatEmployee, signUpManager} = require('./AuthenticationController')
const router = express.Router();
router.use(express.json());

router.post('/signup/customer', signUpFormat,  signUpCustomer);

router.post('/signup/employee', authenticateToken, authorizeManager, signUpFormat, signUpFormatEmployee, signUpEmployee);

router.post('/signup/manager', signUpFormat, signUpFormatManager, signUpManager)

router.post('/login', loginFormat, login)



module.exports = router;
