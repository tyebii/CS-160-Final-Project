const express = require('express')

const {authorizeManager, authorizeEmployee} = require('../Utils/Authorization')

const {authenticateToken} = require('../Utils/Authentication')

const {validateRobot} = require('../Utils/Formatting')

const {getRobot, addRobot, updateRobot, deleteRobot, getFaultyRobot} = require('./RobotController')

const router = express.Router()

router.use([express.json()]);

router.get('/robot', authenticateToken, authorizeEmployee, getRobot)

router.get('/robot/faulty', authenticateToken, authorizeEmployee, getFaultyRobot)

router.post('/robot', authenticateToken, authorizeManager, validateRobot, addRobot)

router.put('/robot', authenticateToken, authorizeManager, validateRobot, updateRobot)

router.delete('/robot', authenticateToken, authorizeManager, deleteRobot)

module.exports = router