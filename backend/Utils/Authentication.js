const jwt = require('jsonwebtoken'); 

const {statusCode} = require('./Formatting')

require('dotenv').config(); 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    console.log("Token Recieved: " + (token!=null))

    if (token == null){
        return res.status(statusCode.UNAUTHORIZED).json({ error: 'No Token' });
    } 

    jwt.verify(token, process.env.Secret_Key, (error, user) => {
        if (error) {
            return res.status(statusCode.UNAUTHORIZED).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    }); 
}

module.exports = {authenticateToken}