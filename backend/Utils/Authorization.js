const {statusCode} = require('./Formatting')

function authorizeEmployee(req, res, next){
    if (req.user.EmployeeID!=null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"not authorized as employee"})
    }
}

function authorizeRegularEmployee(req, res, next){
    if (req.user.EmployeeID!=null && req.user.SupervisorID!=null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"not authorized as standard employee"})
    }
}

function authorizeCustomer(req, res, next){
    if (req.user.CustomerID!=null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"not authorized as customer"})
    }
}

function authorizeManager(req,res,next){
    if(req.user.EmployeeID != null && req.user.SupervisorID == null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"not authorized as manager"})
    }

}

module.exports = {authorizeCustomer, authorizeEmployee, authorizeManager, authorizeRegularEmployee}