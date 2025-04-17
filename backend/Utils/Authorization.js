const {statusCode} = require('./Formatting')

const {logger} = require('./Logger')

//Authorize Employee
function authorizeEmployee(req, res, next){

    logger.info("Authorizing Employee")

    if (req.user.EmployeeID!=null){

        logger.info("Valid Employee")

        next();

    }else{

        logger.error("Invalid Employee")

        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As Employee"})

    }

}

//Authorize Standard Employee
function authorizeRegularEmployee(req, res, next){

    logger.info("Authorizing Regular Employee")

    if (req.user.EmployeeID!=null && req.user.SupervisorID!=null){

        logger.info("Valid Regular Employee")

        next();

    }else{

        logger.error("Invalid Regular Employee")

        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As Standard Employee"})

    }

}

//Authorize Customer
function authorizeCustomer(req, res, next){

    logger.info("Authorizing Customer")

    if (req.user.CustomerID!=null){

        logger.info("Valid Customer")

        next();

    }else{

        logger.info("Invalid Customer")

        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As Customer"})

    }

}

//Authorize Manager
function authorizeManager(req,res,next){

    logger.info("Authorizing Manager")

    if(req.user.EmployeeID != null && req.user.SupervisorID == null){

        logger.info("Valid Manager")

        next();

    }else{

        logger.error("Invalid Manager")

        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As manager"})

    }

}

module.exports = {authorizeCustomer, authorizeEmployee, authorizeManager, authorizeRegularEmployee}