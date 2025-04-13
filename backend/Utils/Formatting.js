const {supervisorExists} = require('./ExistanceChecks')

require('dotenv').config(); 

const validateDate = (input) => {

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (input == null){

        console.log("No Date Found")

        return false

    } 

    if(!datePattern.test(input)){

        console.log("Date Fails The Pattern xxxx-xx-xx")

        return false

    } 
    
    if(validateBlacklist(input)){

        console.log("Blacklisted Characters Found")

        return false;

    } 

    const date = new Date(input);

    const timestamp = date.getTime();

    if (isNaN(timestamp)){

        console.log("Not A Valid Date")

        return false;

    }

    return input === date.toISOString().slice(0, 10);

}

const validateSpaces = (input) => {

    if(/\s/.test(input)){

        console.log("Spaces Detected")

        return true 
    }

        return false

}

const validateBlacklist = (input) => {

    if(/[<>;]/.test(input)){

        console.log("Blacklisted Characters Detected")

        return true

    }

    return false

}

const validateID = (input) => {

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (input == null){

        console.log("Input Not Found")

        return false

    } 
    
    if(typeof input !== 'string'){

        console.log("Must Be A String")

        return false

    } 
    
    if(validateBlacklist(input)){

        console.log("Has Blacklisted Characters")

        return false

    }
    
    if(!uuidRegex.test(input)) {

        console.log("Improper Format On ID")

        return false;

    }

    return true;
    
}

const validateRegularID = (input) => {

    if (input == null) {

         console.log("Input Not Found");

        return false;

    }

    if (typeof input !== 'string') {

        console.log("Must Be A String");

        return false;

    }

    if (input.length < 5) {

        console.log("Input Too Short (Minimum 5 Characters)");

        return false;

    }

    if (input.length > 255) {
        
        console.log("Input Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        console.log("Contains Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        console.log("Has Blacklisted Characters");

        return false;

    }

    return true;

}

const validateAddress = async (address) => {

    if (address == null) {

        console.log("Address Not Found");

        return false;

    }

    if (typeof address !== "string") {

        console.log("Address Must Be A String");

        return false;

    }

    if (address.length < 5) {

        console.log("Address Too Short (Minimum 5 Characters)");

        return false;

    }

    if (address.length > 255) {

        console.log("Address Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateBlacklist(address)) {

        console.log("Address Has Blacklisted Characters");

        return false;

    }

    const regex = /^\d{1,5}\s[A-Za-z0-9\s.'-]+,\sSan\sJose,\sCalifornia\s95\d{3}(-\d{4})?$/;

    if (!regex.test(address)) {

        console.log("Improper Address Format. Expected format: [number] [street name], San Jose, California 95XXX");
        
        return false;

    }

    const encodedAddress = encodeURIComponent(address);

    const accessToken = process.env.MAPBOXSECRET;

    try {

        const response = await fetch(

            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`
        
        );

        const data = await response.json();

        if (data.features.length === 0) {
            
            console.log("Address Not Found On Map");

            return false;

        }

        return true;

    } catch (error) {

        console.error("Mapbox fetch error:", error);

        console.log("Error Validating Address With Mapbox");

        return false;
        
    }
};

const validateQuantity = (input) => {

    if (input == null) {

        console.log("Quantity Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        console.log("Quantity Must Be A Number");

        return false;

    }

    if (input <= 0) {

        console.log("Quantity Must Be Greater Than Zero");

        return false;

    }

    if (!Number.isInteger(input)) {

        console.log("Quantity Must Be An Integer");

        return false;

    }

    return true;
    
}

const validateRobotLoad = (input) => {

    if (input == null) {

        console.log("Robot Load Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        console.log("Robot Load Must Be A Number");

        return false;

    }

    if (input < 0) {

        console.log("Robot Load Cannot Be Negative");

        return false;

    }

    return true;

}

const validateRobotStatus = (input) => {

    const statusList = ['En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired'];

    if (input == null) {

        console.log("Robot Status Not Provided");

        return false;

    }

    if (typeof input !== 'string') {

        console.log("Robot Status Must Be A String");

        return false;

    }

    if (!statusList.includes(input)) {

        console.log(`Invalid Robot Status. Must be one of: ${statusList.join(', ')}`);

        return false;

    }

    return true;
    
}

const validateFutureDate = (input) => {

    if (input == null) {

        console.log("Date Not Provided");

        return false;

    }

    if (!validateDate(input)) {

        return false;

    }

    const date = new Date(input);

    const now = new Date();

    if (isNaN(date.getTime())) {

        console.log("Invalid Date Value");

        return false;

    }

    if (date <= now) {

        console.log("Date Must Be In The Future");

        return false;

    }

    return true;
    
}

const validatePastDate = (input) => {

    if (input == null) {

        console.log("Date Not Provided");

        return false;

    }

    if (!validateDate(input)) {

        console.log("Invalid Date Format");

        return false;

    }

    const date = new Date(input);

    const now = new Date();

    if (isNaN(date.getTime())) {

        console.log("Invalid Date Value");

        return false;

    }

    if (date > now) {

        console.log("Date Must Be In The Past");

        return false;
        
    }

    return true;

}

const validateSpeed = (input) => {

    console.log(typeof input)

    if (input == null) {

        console.log("Speed Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        console.log("Speed Must Be A Number");

        return false;

    }

    if (input < 0) {

        console.log("Speed Cannot Be Negative");

        return false;
        
    }

    return true;
}

const validateBatteryLife = (input) => {

    if (input == null) {

        console.log("Battery Life Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        console.log("Battery Life Must Be A Number");

        return false;

    }

    if (input <= 0) {

        console.log("Battery Life Must Be Greater Than 0%");

        return false;

    }

    if (input > 100) {

        console.log("Battery Life Cannot Exceed 100%");

        return false;

    }

    return true;

}

const validateEstimatedDelivery = (input) => {

    if (input == null) {

        console.log("Estimated Delivery Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        console.log("Estimated Delivery Must Be A Number");

        return false;

    }

    if (input < 0) {

        console.log("Estimated Delivery Must Be Greater Than 0%");

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

    if (input == null) {

        console.log("Name Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        console.log("Name Must Be A String");

        return false;

    }

    if (input.trim() === "") {

        console.log("Name Cannot Be Empty or Whitespace");

        return false;

    }

    if (input.length < 2) {

        console.log("Name Too Short (Minimum 2 Characters)");

        return false;

    }

    if (input.length > 255) {

        console.log("Name Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateBlacklist(input)) {

        console.log("Name Contains Blacklisted Characters");

        return false;

    }

    return true;
    
}

const validatePhoneNumber = (input) => {

    const regexNumber = /^1-\d{3}-\d{3}-\d{4}$/;

    if (input == null) {

        console.log("Phone Number Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        console.log("Phone Number Must Be A String");

        return false;

    }

    if (validateSpaces(input)) {

        console.log("Phone Number Cannot Contain Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        console.log("Phone Number Contains Blacklisted Characters");

        return false;

    }

    if (!input.match(regexNumber)) {

        console.log("Invalid Phone Number Format. Must be in the format: 1-XXX-XXX-XXXX");

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

        console.log("Password Not Provided");

        return false;

    }

    if (typeof input !== 'string') {

        console.log("Password Must Be A String");

        return false;

    }

    if (input.length < 7) {

        console.log("Password Too Short (Minimum 7 Characters)");

        return false;

    }

    if (input.length > 255) {

        console.log("Password Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        console.log("Password Cannot Contain Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        console.log("Password Contains Blacklisted Characters");

        return false;

    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!input.match(regexPassword)) {

        console.log("Password Must Contain At Least One Lowercase Letter, One Uppercase Letter, One Number, and One Special Character");

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

        console.log("Employee Status Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        console.log("Employee Status Must Be A String");

        return false;

    }

    if (!validStatuses.includes(input)) {

        console.log(`Invalid Employee Status. Must be one of: ${validStatuses.join(", ")}`);

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

        console.log("Category Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        console.log("Category Must Be A String");

        return false;

    }

    if (!categoryEnum.includes(input)) {

        console.log(`Invalid Category. Must be one of: ${categoryEnum.join(", ")}`);

        return false;

    }

    return true;
    
}

const validateProduct = (input) => {

    if (input == null) {

        console.log("Product Name Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        console.log("Product Name Must Be A String");

        return false;

    }

    if (input.length == 0) {

        console.log("Product Name Cannot Be Empty");

        return false;

    }

    if (input.length > 255) {

        console.log("Product Name Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        console.log("Product Name Cannot Contain Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        console.log("Product Name Contains Blacklisted Characters");

        return false;

    }

    return true;
    
}

const validateWeight = (input) => {

    if (input == null) {

        console.log("Weight Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        console.log("Weight Must Be A Number");

        return false;

    }

    if (input <= 0) {

        console.log("Weight Must Be Greater Than Zero");

        return false;

    }

    return true;
    
}


const validateCost = (input) => {

    if (input == null) {

        console.log("Cost Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        console.log("Cost Must Be A Number");

        return false;

    }

    if (input <= 0) {

        console.log("Cost Must Be Greater Than Zero");

        return false;

    }

    return true;

}

const validateStorageRequirement = (input) => {

    const validStorage = [
        'Frozen', 'Deep Frozen', 'Cryogenic', 'Refrigerated', 'Cool', 
        'Room Temperature', 'Ambient', 'Warm', 'Hot', 'Dry', 'Moist', 
        'Airtight', 'Dark Storage', 'UV-Protected', 'Flammable', 'Hazardous', 
        'Perishable', 'Non-Perishable'
    ];

    if (input == null) {

        console.log("Storage Requirement Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        console.log("Storage Requirement Must Be A String");

        return false;

    }

    if (!validStorage.includes(input)) {

        console.log(`Invalid Storage Requirement. Must be one of: ${validStorage.join(", ")}`);

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
    insertFormat
}