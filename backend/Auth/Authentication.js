const express = require('express');
const {login, userNameExists, signUpFormat, signUpCustomer, loginFormat} = require('./AuthenticationController')
const router = express.Router();

router.post('/signup/customer', signUpFormat, userNameExists, signUpCustomer);

router.post('/signup/employee', signUpFormat, userNameExists, signUpCustomer);

router.get('/login', loginFormat, login)



module.exports = router;
