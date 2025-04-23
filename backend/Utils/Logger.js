const winston = require('winston');

const { v4: uuidv4 } = require('uuid');

// Custom Format
const customLogFormat = winston.format.printf(({ timestamp, level, message, requestId }) => {

  return `${timestamp} [${level}] [Request ID: ${requestId}]: ${message}`;

});

// Logger Instance
const logger = winston.createLogger({

  level: 'info',

  format: winston.format.combine(

    winston.format.timestamp(),  

    winston.format.printf(({ timestamp, level, message, requestId }) => {

      return `${timestamp} [${level}]: ${message}`;

    })

  ),

  transports: [

    new winston.transports.Console({

      format: winston.format.combine(

        winston.format.colorize(), 

        customLogFormat

      )

    }),

    new winston.transports.File({

      filename: 'app.log',

      format: winston.format.combine(winston.format.timestamp(), customLogFormat)

    })

  ]

});

// Middleware to generate unique requestId for each request
const logWithRequestId = (req, res, next) => {
  const requestId = uuidv4(); 
  req.requestId = requestId;  

  logger.defaultMeta = { requestId };

  next();  
  
};

module.exports = { logger, logWithRequestId };
