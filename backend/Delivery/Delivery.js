const express = require('express')

const router = express.Router()

const {authenticateToken} = require('../Utils/Authentication.js')

const {authorizeManager} = require('../Utils/Authorization.js')

const {scheduleRobots, deployRobots} = require('./DeliveryController.js')

const rateLimit = require('express-rate-limit');

//Rate Limiter
const deliveryLimiter = rateLimit({

    windowMs: 60 * 1000 * 2, 

    max: 20, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(deliveryLimiter)

//Deploys The Robots
router.put("/deploy", deployRobots)

//Schedules The Robots
router.put("/schedule", authenticateToken, authorizeManager, scheduleRobots)

module.exports = router
