const express = require('express')
const { authenticateToken, authorizeManager, authorizeEmployee } = require('../Auth/AuthenticationController')
const {getRobot, addRobot, updateRobot, deleteRobot} = require('./RobotController')
const router = express.Router()

router.get('/robot', authenticateToken, authorizeEmployee, getRobot)

router.post('robot', authenticateToken, authorizeManager, addRobot)

router.put('/robot', authenticateToken, authorizeManager, updateRobot)

router.delete('/robot', authenticateToken, authorizeManager, deleteRobot)