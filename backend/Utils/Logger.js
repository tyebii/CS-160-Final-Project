const winston = require('winston');

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(), 
    logFormat 
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), logFormat) }),
    new winston.transports.File({ filename: 'app.log' }) 
  ]
});

module.exports = logger;