const jwt = require('jsonwebtoken'); 

const {statusCode} = require('./Formatting')

const {logger} = require('./Logger')

require('dotenv').config(); 

function authenticateToken(req, res, next) {

    logger.info("Starting Authentication")

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    logger.info("Token Recieved: " + (token!=null))

    if (token == null){

        logger.error("Token Not Recieved")

        return res.status(statusCode.UNAUTHORIZED).json({ error: 'No Token' });

    } 

    logger.info("Verifying Token")

    jwt.verify(token, process.env.Secret_Key, (error, user) => {

        if (error) {

            logger.error("JWT Not Authentic")

            return res.status(statusCode.UNAUTHORIZED).json({ error: 'Invalid token' });

        }

        req.user = user;

        logger.info("Authentication Done")

        next();

    }); 

}

module.exports = {authenticateToken}