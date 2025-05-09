const {supervisorExists} = require('./ExistanceChecks')

const {logger} = require('../Utils/Logger'); 

require('dotenv').config(); 

const validateDate = (input) => {

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (input == null){

        logger.error("No Date Found")

        return false

    } 

    if(!datePattern.test(input)){

        logger.error("Date Fails The Pattern xxxx-xx-xx")

        return false

    } 

    const date = new Date(input);

    const timestamp = date.getTime();

    if (isNaN(timestamp)){

        logger.error("Not A Valid Date")

        return false;

    }

    return input === date.toISOString().slice(0, 10);

}

const validateSpaces = (input) => {

    if(/\s/.test(input)){

        logger.error("Spaces Detected")

        return true 
    }

        return false

}

const validateBlacklist = (input) => {

    const blacklistPattern = /[^a-zA-Z0-9]/;

    if (blacklistPattern.test(input)) {

        logger.error("Blacklisted Characters Detected")

        return true; 
        
    }

    return false

}

const validateID = (input) => {

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (input == null){

        logger.error("Input Not Found")

        return false

    } 
    
    if(typeof input !== 'string'){

        logger.error("Must Be A String")

        return false

    } 
    
    if(validateBlacklist(input)){

        logger.error("ID Has Blacklisted Characters")

        return false

    }
    
    if(!uuidRegex.test(input)) {

        logger.error("Improper Format On ID")

        return false;

    }

    return true;
    
}

const validateRegularID = (input) => {

    if (input == null) {

         logger.error("Input Not Found");

        return false;

    }

    if (typeof input !== 'string') {

        logger.error("Must Be A String");

        return false;

    }

    if (input.length < 5) {

        logger.error("Input Too Short (Minimum 5 Characters)");

        return false;

    }

    if (input.length > 255) {
        
        logger.error("Input Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        logger.error("Contains Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        logger.error("ID Has Blacklisted Characters");

        return false;

    }

    return true;

}

const validateAddress = async (address) => {

    if (address == null) {

        logger.error("Address Not Found");

        return false;

    }

    if (typeof address !== "string") {

        logger.error("Address Must Be A String");

        return false;

    }

    if (address.length < 5) {

        logger.error("Address Too Short (Minimum 5 Characters)");

        return false;

    }

    if (address.length > 255) {

        logger.error("Address Too Long (Maximum 255 Characters)");

        return false;

    }

    const regex = /,\s*San\s+Jose,\s*(California|CA)/i;

    if (!regex.test(address)) {

        logger.error("Must Be In San Jose California");
        
        return false;

    }

    const encodedAddress = encodeURIComponent(address);

    const accessToken = process.env.MAPBOXSECRET;

    try {

        const response = await fetch(

            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`
        
        );

        const data = await response.json();

        if (!data || data.features.length === 0) {
            
            logger.error("Address Not Found On Map");

            return false;

        }

        logger.info("Address Found On Map");

        return true;

    } catch (error) {

        console.error("Mapbox fetch error: ", error);

        logger.error("Error Validating Address With Mapbox");

        return false;
        
    }
};

const validateQuantity = (input) => {

    if (input == null) {

        logger.error("Quantity Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        logger.error("Quantity Must Be A Number");

        return false;

    }

    if (input <= 0) {

        logger.error("Quantity Must Be Greater Than Zero");

        return false;

    }

    if (!Number.isInteger(input)) {

        logger.error("Quantity Must Be An Integer");

        return false;

    }

    return true;
    
}

const validateRobotLoad = (input) => {

    if (input == null) {

        logger.error("Robot Load Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        logger.error("Robot Load Must Be A Number");

        return false;

    }

    if (input < 0) {

        logger.error("Robot Load Cannot Be Negative");

        return false;

    }

    return true;

}

const validateRobotStatus = (input) => {

    const statusList = ['En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired'];

    if (input == null) {

        logger.error("Robot Status Not Provided");

        return false;

    }

    if (typeof input !== 'string') {

        logger.error("Robot Status Must Be A String");

        return false;

    }

    if (!statusList.includes(input)) {

        logger.error(`Invalid Robot Status. Must be one of: ${statusList.join(', ')}`);

        return false;

    }

    return true;
    
}

const validateFutureDate = (input) => {

    if (input == null) {

        logger.error("Date Not Provided");

        return false;

    }

    if (!validateDate(input)) {

        return false;

    }

    const date = new Date(input);

    const now = new Date();

    if (isNaN(date.getTime())) {

        logger.error("Invalid Date Value");

        return false;

    }

    if (date <= now) {

        logger.error("Date Must Be In The Future");

        return false;

    }

    return true;
    
}

const validatePastDate = (input) => {

    if (input == null) {

        logger.error("Date Not Provided");

        return false;

    }

    if (!validateDate(input)) {

        logger.error("Invalid Date Format");

        return false;

    }

    const date = new Date(input);

    const now = new Date();

    if (isNaN(date.getTime())) {

        logger.error("Invalid Date Value");

        return false;

    }

    if (date > now) {

        logger.error("Date Must Be In The Past");

        return false;
        
    }

    return true;

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

    next();

}

const validateName = (input) => {

    if (input == null) {

        logger.error("Name Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        logger.error("Name Must Be A String");

        return false;

    }

    if (input.trim() === "") {

        logger.error("Name Cannot Be Empty or Whitespace");

        return false;

    }

    if (input.length < 2) {

        logger.error("Name Too Short (Minimum 2 Characters)");

        return false;

    }

    if (input.length > 255) {

        logger.error("Name Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateBlacklist(input)) {

        logger.error("Name Contains Blacklisted Characters");

        return false;

    }

    return true;
    
}

const validatePhoneNumber = (input) => {

    const regexNumber = /^\d{11}$/;

    if (input == null) {

        logger.error("Phone Number Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        logger.error("Phone Number Must Be A String");

        return false;

    }

    if (validateSpaces(input)) {

        logger.error("Phone Number Cannot Contain Spaces");

        return false;

    }

    if (!input.match(regexNumber)) {

        logger.error("Invalid Phone Number Format. Must be in the format: XXXXXXXXXXX");

        return false;

    }

    return true;

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

    if (!validatePhoneNumber(UserPhoneNumber)) {

        return res.status(statusCode.BAD_REQUEST).json({error:"Phone Number Format Invalid"})
        
    }

    next();
    
}

const validatePassword = (input) => {

    if (input == null) {

        logger.error("Password Not Provided");

        return false;

    }

    if (typeof input !== 'string') {

        logger.error("Password Must Be A String");

        return false;

    }

    if (input.length < 7) {

        logger.error("Password Too Short (Minimum 7 Characters)");

        return false;

    }

    if (input.length > 255) {

        logger.error("Password Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        logger.error("Password Cannot Contain Spaces");

        return false;

    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!input.match(regexPassword)) {

        logger.error("Password Must Contain At Least One Lowercase Letter, One Uppercase Letter, One Number, and One Special Character");

        return false;

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

    if (!validatePhoneNumber(UserPhoneNumber)) {

        return res.status(statusCode.BAD_REQUEST).json({error:"Phone Number Format Invalid"})

    }

    if (!validatePassword(Password)) {

        return res.status(statusCode.BAD_REQUEST).json({ error: "Password Format Invalid" });

    }

    next();

}

const validateEmployeeStatus = (input) => {

    const validStatuses = ["Employed", "Absence", "Fired"];

    if (input == null) {

        logger.error("Employee Status Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        logger.error("Employee Status Must Be A String");

        return false;

    }

    if (!validStatuses.includes(input)) {

        logger.error(`Invalid Employee Status. Must be one of: ${validStatuses.join(", ")}`);

        return false;

    }

    return true;

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

    const categoryEnum = [
        'Fresh Produce',
        'Dairy and Eggs',
        'Meat and Seafood',
        'Frozen Foods',
        'Bakery and Bread',
        'Pantry Staples',
        'Beverages',
        'Snacks and Sweets',
        'Health and Wellness'
    ];

    if (input == null) {

        logger.error("Category Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        logger.error("Category Must Be A String");

        return false;

    }

    if (!categoryEnum.includes(input)) {

        logger.error(`Invalid Category. Must be one of: ${categoryEnum.join(", ")}`);

        return false;

    }

    return true;
    
}

const validateProduct = (input) => {

    if (input == null) {

        logger.error("Product Name Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        logger.error("Product Name Must Be A String");

        return false;

    }

    if (input.length == 0) {

        logger.error("Product Name Cannot Be Empty");

        return false;

    }

    if (input.length > 255) {

        logger.error("Product Name Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        logger.error("Product Name Cannot Contain Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        logger.error("Product Name Contains Blacklisted Characters");

        return false;

    }

    return true;
    
}

const validateWeight = (input) => {

    if (input == null) {

        logger.error("Weight Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        logger.error("Weight Must Be A Number");

        return false;

    }

    if (input <= 0) {

        logger.error("Weight Must Be Greater Than Zero");

        return false;

    }

    return true;
    
}


const validateCost = (input) => {

    if (input == null) {

        logger.error("Cost Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        logger.error("Cost Must Be A Number");

        return false;

    }

    if (input <= 0) {

        logger.error("Cost Must Be Greater Than Zero");

        return false;

    }

    return true;

}

const validateDateTime = (input) => {

    const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

    if (input == null) {

        logger.error("No DateTime Found");

        return false;

    }

    if (!dateTimePattern.test(input)) {

        logger.error("DateTime fails the pattern yyyy-mm-ddTHH:MM(:SS)");

        return false;

    }

    const date = new Date(input);

    if(date > new Date()){

        logger.error("No Future Dates");

        return false
        
    }

    const timestamp = date.getTime();

    if (isNaN(timestamp)) {

        logger.error("Not A Valid DateTime");

        return false;

    }

    const isoInput = input.length === 16

        ? input + ":00"  

        : input;

    const normalized = new Date(isoInput).toISOString().slice(0, isoInput.length);

    return input === normalized;

};

const validateStorageRequirement = (input) => {

    const validStorage = [
        'Frozen', 'Deep Frozen', 'Cryogenic', 'Refrigerated', 'Cool', 
        'Room Temperature', 'Ambient', 'Warm', 'Hot', 'Dry', 'Moist', 
        'Airtight', 'Dark Storage', 'UV-Protected', 'Flammable', 'Hazardous', 
        'Perishable', 'Non-Perishable'
    ];

    if (input == null) {

        logger.error("Storage Requirement Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        logger.error("Storage Requirement Must Be A String");

        return false;

    }

    if (!validStorage.includes(input)) {

        logger.error(`Invalid Storage Requirement. Must be one of: ${validStorage.join(", ")}`);

        return false;

    }

    return true;

}

const validateTransactionStatus = (input) => {

    const validStorage = ['In progress','Complete', 'Delivering', 'Failed','Pending Delivery'];

    if (input == null) {

        logger.error("Transaction Status Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        logger.error("Transaction Status Must Be A String");

        return false;

    }

    if (!validStorage.includes(input)) {

        logger.error(`Invalid Transaction Status. Must be one of: ${validStorage.join(", ")}`);

        return false;

    }

    return true;
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
    insertFormat,
    validateTransactionStatus,
    validateCost,
    validateWeight,
    validateFutureDate,
    validateDateTime,
    validatePastDate,
    validatePhoneNumber
}
