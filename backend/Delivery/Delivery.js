const express = require('express')

const router = express.Router()

const {handleSchedule} = require('./DeliveryController.js')

router.post("/schedule/robots", handleSchedule)

module.exports = {router}
