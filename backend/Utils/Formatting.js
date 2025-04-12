const {supervisorExists} = require('./ExistanceChecks')

require('dotenv').config(); 


const validateDate = (input) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (input == null || !datePattern.test(input) || validateBlacklist(input)) return false;
    const date = new Date(input);
    const timestamp = date.getTime();
    if (isNaN(timestamp)) return false;

    return input === date.toISOString().slice(0, 10);
}

const validateSpaces = (input) => {return /\s/.test(input)}

const validateBlacklist = (input) => {return /[<>;]/.test(input)}

const validateID = (input) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (input == null || typeof input !== 'string' || input.length < 5 || input.length > 255 || validateBlacklist(input) || !uuidRegex.test(input)) {
        return false;
    }
    return true;
}

const validateRegularID = (input) => {
    if (input == null || typeof input !== 'string' || input.length < 5 || input.length > 255 || validateSpaces(input) || validateBlacklist(input)) {
        return false;
    }
    return true;
}

const validateAddress = async (address) => {
    if (
        address == null ||
        typeof address !== "string" ||
        address.length < 5 ||
        address.length > 255 ||
        validateBlacklist(address)
    ) {
        return false;
    }

    // Matches: [number] [street name], San Jose, California 95XXX (or ZIP+4)
    const regex = /^\d{1,5}\s[A-Za-z0-9\s.'-]+,\sSan\sJose,\sCalifornia\s95\d{3}(-\d{4})?$/;

    if (!regex.test(address)) {
        return false;
    }

    const encodedAddress = encodeURIComponent(address);
    const accessToken = process.env.MAPBOXSECRET;

    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`
        );
        const data = await response.json();

        return data.features.length > 0;
    } catch (error) {
        console.error("Mapbox fetch error:", error);
        return false;
    }
};

const validateQuantity = (input) => {
    if (input == null || typeof input !== 'number' || input <= 0 || !Number.isInteger(input)) {
        return false; 
    }

    return true; 
}

const validateRobotLoad = (input) => {
    if (input == null || typeof input !== 'number' || input < 0) {
        return false; 
    }

    return true; 
}

const validateRobotStatus = (input) => {
    const statusList = ['En Route','Broken','Maintenance','Charging','Free']
    return statusList.includes(input)
}

const validateFutureDate = (input) => {
    if(!validateDate(input) && newDate(input) < new Date()){
        return false
    }
    return true
}

const validatePastDate = (input) => {
    if(!validateDate(input) && newDate(input) > new Date()){
        return false
    }
    return true
}

const validateSpeed = (input) => {
    if (input == null || typeof input !== 'number' || input < 0) {
        return false; 
    }

    return true; 
}

const validateBatteryLife = (input) => {
    if (input == null || typeof input !== 'number' || input <= 0 || input>100) {
        return false; 
    }
    return true
}

const validateEstimatedDelivery = (input) => {
    if(!validateDate(input) && newDate(input) <= new Date()){
        return false
    }
    return true
}

const validateRobot = (req, res, next) => {
    if(!validateRegularID(req.body.RobotID)){
        return res.status(statusCode.BAD_REQUEST).json({error:"RobotID Format Invalid"})
    } 
    
    if(!validateRobotLoad(req.body.CurrentLoad)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Current Load Format Invalid"})
    } 
    
    if(!validateRobotStatus(req.body.RobotStatus)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Robot Status Format Invalid"})
    } 

    if(!validateFutureDate(req.body.Maintanence)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Maintenance Date Format Invalid"})
    } 
    
    if(!validateSpeed(req.body.Speed)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Speed Format Invalid"})
    } 

    if(!validateBatteryLife(req.body.BatteryLife)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Battery Life Format Invalid"})
    } 
    
    if(!validateEstimatedDelivery(req.body.EstimatedDelivery)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Estimated Delivery Format Invalid"})
    }

    next();
}

const validateName = (input) => {
    if (input == null || typeof input != "string" || input.trim() == "" || input.length < 2 || input.length > 255 || validateBlacklist(input)) {
        return false
    }
    
    return true
}

const validatePhoneNumber = (input) => {
    const regexNumber = /^1-\d{3}-\d{3}-\d{4}$/;
    
    if(input == null || typeof input != "string" || validateSpaces(input) || validateBlacklist(input) || !input.match(regexNumber)){
        return false
    }
}

const employeeFormat = (req, res, next) => {

    if(!validateRegularID(req.body.UserID)){
        return res.status(statusCode.BAD_REQUEST).json({error:"UserID Format Invalid"})
    }

    req.body.UserID = req.body.UserID.toLowerCase();

    const {UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    if(!validateName(UserNameFirst)){
        return res.status(statusCode.BAD_REQUEST).json({error:"First Name Format Invalid"})
    }
    
    if(!validateName(UserNameLast)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Last Name Format Invalid"})
    }

    if (validatePhoneNumber(UserPhoneNumber)) {
        return res.status(statusCode.BAD_REQUEST).json({error:"Phone Number Format Invalid"})
    }

    next();
}

const validatePassword = (input) => {
    if (input == null || typeof input !== 'string' || input.length < 7 || input.length > 255 || validateSpaces(input) || validateBlacklist(input)) {
        return false;
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if(!input.match(regexPassword)){
        return false
    }

    return true;
}

const loginFormat = (req,res,next) => {

    if (!validateRegularID(req.body.UserID)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Username Not Found"})
    }

    req.body.UserID = req.body.UserID.toLowerCase()

    if (!validatePassword(req.body.Password)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Password Not Found"})
    }

    next();
}

const signUpFormat = (req, res, next) => {

    if (!validateRegularID(req.body.UserID)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Username Format Illegal"})
    }

    req.body.UserID = req.body.UserID.toLowerCase();

    const { Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    if(!validateName(UserNameFirst)){
        return res.status(statusCode.BAD_REQUEST).json({error:"First Name Format Invalid"})
    }

    if(!validateName(UserNameLast)){
        return res.status(statusCode.BAD_REQUEST).json({error:"Last Name Format Invalid"})
    }

    if (validatePhoneNumber(UserPhoneNumber)) {
        return res.status(statusCode.BAD_REQUEST).json({error:"Phone Number Format Invalid"})
    }

    if (!validatePassword(Password)) {
        return res.status(statusCode.BAD_REQUEST).json({ error: "Password Format Invalid" });
    }

    next();
}

const validateEmployeeStatus = (input) => {
    const validStatuses = ["Employed", "Absence", "Fired"];
    return validStatuses.includes(input)
}

const validateEmployeeHourly = (input) => {
    if (input == null || typeof input !== 'number' || input < 0) {
        return false; 
    }

    return true; 
}

const signUpFormatEmployee = async (req, res, next) => {

    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly,
        SupervisorID
    } = req.body;

    if(!validatePastDate(EmployeeHireDate)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHireDate Format Invalid"})
    }

    if(!validatePastDate(EmployeeBirthDate)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeBirthDate Format Invalid"}) 
    }

    if(!validateEmployeeStatus(EmployeeStatus)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeStatus Format Invalid"})     
    }

    if(!validateName(EmployeeDepartment)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeDepartment Format Invalid"})     
    }

    if(!validateEmployeeHourly(EmployeeHourly)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHourly Format Invalid"})        
    }

    if(!validateID(SupervisorID)){
        return res.status(statusCode.BAD_REQUEST).json({error:"SupervisorID Format Invalid"})
    }

    try {
        const notFailed = await supervisorExists(SupervisorID);
        if (!notFailed) {
            return res.status(statusCode.BAD_REQUEST).json({ error: "Supervisor ID Does Not Exist" });
        }
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Checking Supervisor ID"});
    }

    next();
}

const signUpFormatManager = (req, res, next) => {

    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly
    } = req.body;

    
    if(!validatePastDate(EmployeeHireDate)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHireDate Format Invalid"})
    }

    if(!validatePastDate(EmployeeBirthDate)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeBirthDate Format Invalid"}) 
    }

    if(!validateEmployeeStatus(EmployeeStatus)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeStatus Format Invalid"})     
    }

    if(!validateName(EmployeeDepartment)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeDepartment Format Invalid"})     
    }

    if(!validateEmployeeHourly(EmployeeHourly)){
        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHourly Format Invalid"})        
    }

    next();
}

const validateCategory = (input) => {
    console.log(input)
    const categoryEnum = ['Fresh-Produce','Dairy-and-Eggs','Meat-and-Seafood','Frozen-Foods','Bakery-and-Bread','Pantry-Staples','Beverages','Snacks-and-Sweets','Health-and-Wellness']
    return categoryEnum.includes(input)
}

const validateProduct = (input) => {
    if (input == null || typeof input != "string" || input.length == 0 || input.length > 255 || validateSpaces(input) || validateBlacklist(input)) {
        return false
    }

    return true
}

const validateWeight = (input) => {
    if (input == null || typeof input !== 'number' || input <= 0) {
        return false; 
    }

    return true; 
}

const validateCost = (input) => {
    if (input == null || typeof input !== 'number' || input <= 0) {
        return false; 
    }

    return true; 
}

const validateStorageRequirement = (input) => {
    const validStorage = ['Frozen','Deep Frozen','Cryogenic','Refrigerated','Cool','Room Temperature','Ambient','Warm','Hot','Dry','Moist','Airtight','Dark Storage','UV-Protected','Flammable','Hazardous','Perishable','Non-Perishable']
    return validStorage.includes(input)
}

const insertFormat = (Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description) => {

    if(!validateName(Distributor)){
        return false
    }

    if(!validateName(ProductName)){
        return false
    }

    if(!validateWeight(Weight)){
        return false
    }

    if(!validateQuantity(Quantity)){
        return false
    }

    if(!validateCategory(Category)){
        return false
    }

    if(!validateCost(Cost)){
        return false
    }

    if(!validateFutureDate(Expiration)){
        return false
    }

    if(!validateStorageRequirement(StorageRequirement)){
        return false
    }

    if(!validateCost(SupplierCost)){
        return false
    }

    if(!validateName(Description)){
        return false
    }
    return true
}

const statusCode = {
    "OK": 200,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "INTERNAL_SERVER_ERROR": 500,
    "SERVICE_UNAVAILABLE": 503,
    "RESOURCE_CONFLICT":409
}

module.exports = {
    validateDate,
    validateSpaces,
    validateID,
    statusCode,
    validateAddress,
    validateQuantity,
    validateRegularID,
    validateRobot,
    employeeFormat,
    loginFormat,
    signUpFormat,
    validateName,
    signUpFormatEmployee,
    signUpFormatManager,
    validateCategory,
    validateProduct,
    insertFormat
}