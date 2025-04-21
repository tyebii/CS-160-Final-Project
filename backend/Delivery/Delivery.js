const express = require('express')

const router = express.Router()

const {authenticateToken} = require('../Utils/Authentication.js')

const {authorizeManager} = require('../Utils/Authorization.js')

const {scheduleRobots, deployRobots} = require('./DeliveryController.js')

router.put("/deploy", deployRobots)

router.put("/schedule", authenticateToken, authorizeManager, scheduleRobots)

module.exports = router
