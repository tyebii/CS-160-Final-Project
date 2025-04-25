const express = require('express')

const {authorizeManager, authorizeEmployee} = require('../Utils/Authorization')

const {authenticateToken} = require('../Utils/Authentication')

const {validateRobot} = require('../Utils/Formatting')

const {getRobot, addRobot, updateRobot, deleteRobot, getFaultyRobot} = require('./RobotController')

const rateLimit = require('express-rate-limit');

const router = express.Router()

//Rate Limiter
const robotLimiter = rateLimit({

    windowMs: 60 * 1000 * 2, 

    max: 50, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(robotLimiter)

router.use([express.json()]);

//Get The Robots
router.get('/robot', authenticateToken, authorizeEmployee, getRobot)

//Get The Faulty Robots
router.get('/robot/faulty', authenticateToken, authorizeEmployee, getFaultyRobot)

//Add A Robot
router.post('/robot', authenticateToken, authorizeManager, validateRobot, addRobot)

//Update A Robot
router.put('/robot', authenticateToken, authorizeManager, validateRobot, updateRobot)

//Delete A Robot
router.delete('/robot', authenticateToken, authorizeManager, deleteRobot)

module.exports = router