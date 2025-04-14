const {statusCode} = require('./Formatting')

function authorizeEmployee(req, res, next){
    if (req.user.EmployeeID!=null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As Employee"})
    }
}

function authorizeRegularEmployee(req, res, next){
    if (req.user.EmployeeID!=null && req.user.SupervisorID!=null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As Standard Employee"})
    }
}

function authorizeCustomer(req, res, next){
    if (req.user.CustomerID!=null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As Customer"})
    }
}

function authorizeManager(req,res,next){
    if(req.user.EmployeeID != null && req.user.SupervisorID == null){
        next();
    }else{
        return res.status(statusCode.FORBIDDEN).json({error:"Not Authorized As manager"})
    }

}

module.exports = {authorizeCustomer, authorizeEmployee, authorizeManager, authorizeRegularEmployee}