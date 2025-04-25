const express = require('express');

const {authenticateToken} = require('../Utils/Authentication')

const {authorizeManager} = require('../Utils/Authorization')

const {loginFormat, signUpFormat, signUpFormatManager, signUpFormatEmployee} = require('../Utils/Formatting')

const {login, signUpCustomer, signUpEmployee, signUpManager, checkCookie, clearCookie} = require('./AuthenticationController')

const rateLimit = require('express-rate-limit');

const router = express.Router();

//Rate Limiter
const authLimiter = rateLimit({

    windowMs: 60 * 1000 * 5, 

    max: 10, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

const cookieLimiter = rateLimit({

    windowMs: 60 * 1000 * 4, 

    max: 50, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(express.json()); 

//Signup Customer
router.post('/signup/customer', authLimiter, signUpFormat,  signUpCustomer);

//Signup Employee
router.post('/signup/employee', authLimiter, authenticateToken, authorizeManager, signUpFormat, signUpFormatEmployee, signUpEmployee);

//Signup Manager
router.post('/signup/manager', authLimiter, signUpFormat, signUpFormatManager, signUpManager)

//Login
router.post('/login', authLimiter, loginFormat, login)

//Check Cookie Role
router.get('/check', cookieLimiter, authenticateToken, checkCookie)

//Delete The Cookie
router.delete('/signout', cookieLimiter, authenticateToken, clearCookie)

module.exports = router;
