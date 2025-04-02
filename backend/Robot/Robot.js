const express = require('express')
const { authenticateToken, authorizeManager, authorizeEmployee} = require('../Auth/AuthenticationController')
const {getRobot, addRobot, updateRobot, deleteRobot, getFaultyRobot} = require('./RobotController')
const router = express.Router()
router.use([express.json()]);

router.get('/robot', authenticateToken, authorizeEmployee, getRobot)

router.get('/robot/Faulty', authenticateToken, authorizeEmployee, getFaultyRobot)

router.post('robot', authenticateToken, authorizeManager, addRobot)

router.put('/robot', authenticateToken, authorizeManager, updateRobot)

router.delete('/robot', authenticateToken, authorizeManager, deleteRobot)

module.exports = router