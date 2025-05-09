const {supervisorExists} = require('./ExistanceChecks')

const {logger} = require('../Utils/Logger'); 

require('dotenv').config(); 




//---------------------------------------------------------------------------------------------------------------
// -------------------------------Helper Functions For Generalized Validation------------------------------------
//---------------------------------------------------------------------------------------------------------------




//Checks if the value is null
const isNull = (value, message) => { if (value == null) throw new Error(message); };

//Checks if the vvalue is a string
const isString = (value, message) => { if (typeof value !== 'string') throw new Error(message); };

//Checks if the value is a number
const isNumber = (value, message) => { if (typeof value !== 'number') throw new Error(message); };

//Checks if the value is an integer
const isInteger = (value, message) => {

  if (!Number.isInteger(value)) throw new Error(message);

};

//Checks if the value matches the regex
const matches = (value, regex, message) => { if (!regex.test(value)) throw new Error(message); };

//Checks if the value falls within the specified range
const inRange = (value, min, max, message) => { if (value < min || value > max) throw new Error(message); };

//Checks if the value can be found in a specified list
const inList = (value, list, message) => { if (!list.includes(value)) throw new Error(message); };

//Checks if there are spaces in the value
const hasNoSpaces = (value, message) => { if (/\s/.test(value)) throw new Error(message); };

//Checks if the value is a valid UUID
const isUUID = (value, message) => {

  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!uuidRegex.test(value)) throw new Error(message);

};

//Checks if the value is a valid number with a specified max decimal places and limit
const isValidDecimal = (value, maxDecimals, maxValue, message) => {

  const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`);

  if (!regex.test(value)) throw new Error(message); 

  if (value > maxValue) throw new Error(message); 

};

//Checks if the value is a valid date
const isISODate = (value, message) => {

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) throw new Error(message);

  const date = new Date(value);

  if (isNaN(date.getTime())) throw new Error('Not a valid date');

  const normalized = date.toISOString().slice(0, 10);

  if (value !== normalized) throw new Error(message);

};

//Checks if the value is a valid date in the past
const isPastDate = (value, message) => {

    const today = new Intl.DateTimeFormat('en-CA', {

        timeZone: 'America/Los_Angeles',

        year: 'numeric',

        month: '2-digit',

        day: '2-digit',

    }).format(new Date()); 

    if (value > today) {

        throw new Error(message);

    }

};

//Checks if the value is a valid date in the future
const isFutureDate = (value, message) => {

    const today = new Intl.DateTimeFormat('en-CA', {

        timeZone: 'America/Los_Angeles',

        year: 'numeric',

        month: '2-digit',

        day: '2-digit',

    }).format(new Date()); 

    if (value <= today) {

        throw new Error(message);

    }

};

//Validate Item Belonging To A List
const validateEnum = (input, list, label) => validate(input, [

  () => isNull(input, `${label}: ${label} Not Provided`),

  () => isString(input, `${label}: ${label} Must Be A String`),

  () => inList(input, list, `${label}: Invalid ${label}. Must be one of: ${list.join(', ')}`)

]);

//Checks the input against the selected validators
const validate = (input, validators) => {

  try {

    for (const func of validators) func();

    return true;

  } catch (err) {

    logger.error(err.message);

    return false;

  }

};




//---------------------------------------------------------------------------------------------------------------
// -------------------------------Field Validations--------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------




//Validate Regular ID
const validateRegularID = (input, label) => validate(input, [

    () => isNull(input, `${label}: ID Input Not Found`),
  
    () => isString(input, `${label}: ID Must Be A String`),
  
    () => inRange(input.length, 5, 255, `${label}: ID Input must be 5–255 characters`),
  
    () => hasNoSpaces(input, `${label}: Contains Spaces`),
  
    () => matches(input, /^[a-zA-Z0-9]+$/, `${label}: ID Must be alphanumeric`)
  
]);

//Validate UUID
const validateID = (input, label) => validate(input, [

    () => isNull(input, `${label}: Input Not Found`),
  
    () => isString(input, `${label}: Must Be A String`),
  
    () => isUUID(input, `${label}: Improper Format On ID`)
  
]);

//Validate Date
const validateDate = (input, label) => validate(input, [

  () => isNull(input, `${label}: No Date Found`),

  () => isISODate(input, `${label}: Date Fails The Pattern xxxx-xx-xx`)

]);

//Validate Future Date
const validateFutureDate = (input, label) => validate(input, [

    () => isNull(input, `${label}: Date Not Provided`),
  
    () => isISODate(input, `${label}: Date Fails The Pattern xxxx-xx-xx`),
  
    () => isFutureDate(input, `${label}: Date Must Be In The Future`)
  
]);
  
//Validate Past Date
const validatePastDate = (input, label) => validate(input, [
  
    () => isNull(input, `${label}: Date Not Provided`),
  
    () => isISODate(input, `${label}: Date Fails The Pattern xxxx-xx-xx`),
  
    () => isPastDate(input, `${label}: Date Must Be In The Past`)
  
]);

//Validate Name
const validateName = (input, label) => validate(input, [

    () => isNull(input, `${label}: Name Not Provided`),
  
    () => isString(input, `${label}: Name Must Be A String`),
  
    () => inRange(input.trim().length, 2, 255, `${label}: Name must be 2–255 characters`),
  
    () => matches(input, /^[a-zA-Z]+(?: [a-zA-Z]+)*$/, `${label}: Name must be alphabetical`)
  
]);

//Validate Description
const validateDescription = (input, label) => validate(input, [

  () => isNull(input, `${label}: Description Not Provided`),

  () => isString(input, `${label}: Description Must Be A String`),

  () => inRange(input.trim().length, 2, 255, `${label}: Description must be 2–255 characters`),

  () => matches(input, /^[a-zA-Z0-9\s.,'\-?!]*$/, `${label}: Description must be alphabetical`)

]);

//Validate Phone Number
const validatePhoneNumber = (input, label) => validate(input, [

    () => isNull(input, `${label}: Phone Number Not Provided`),
  
    () => isString(input, `${label}: Phone Number Must Be A String`),
  
    () => hasNoSpaces(input, `${label}: Phone Number Cannot Contain Spaces`),
  
    () => matches(input, /^\d{11}$/, `${label}: Invalid Phone Number Format. Must be in the format: XXXXXXXXXXX`)
  
]);

//Validate Password
const validatePassword = (input, label) => validate(input, [

    () => isNull(input, `${label}: Password Not Provided`),
  
    () => isString(input, `${label}: Password Must Be A String`),
  
    () => inRange(input.length, 8, 255, `${label}: Password must be 8–255 characters`),
  
    () => hasNoSpaces(input, `${label}: Password Cannot Contain Spaces`),
  
    () => matches(input, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, `${label}: Password must contain upper, lower, number, and special character`)
  
]);

//Validate Quantity
const validateQuantity = (input, label) => validate(input, [

    () => isNull(input, `${label}: Quantity Not Provided`),
  
    () => isNumber(input, `${label}: Quantity Must Be A Number`),
  
    () => isInteger(input, `${label}: Quantity Must Be an Integer`),
  
    () => inRange(input, 1, 5000, `${label}: Quantity Must Be Between 1 and 5000`)
  
]);

//Validate Weight
const validateWeight = (input, label) => validate(input, [

    () => isNull(input, `${label}: Weight Not Provided`),

    () => isNumber(input, `${label}: Weight Must Be A Number`),

    () => inRange(input, 0.01, 1000, `${label}: Weight Must Be Between 0.01 and 1000`),

    () => isValidDecimal(input, 2, 1000, `${label}: Weight cannot have more than 2 decimal places or exceed 1000`)

]);

//Validate Cost
const validateCost = (input, label) => validate(input, [

    () => isNull(input, `${label}: Cost Not Provided`),
  
    () => isNumber(input, `${label}: Cost Must Be A Number`),
  
    () => inRange(input, 0.01, 100000, `${label}: Cost Must Be Between 0.01 and 100000`),
  
    () => isValidDecimal(input, 2, 100000, `${label}: Cost cannot have more than 2 decimal places or exceed 100000`)
  
]);

//Validate Employee Hourly
const validateEmployeeHourly = (input, label) => validate(input, [

    () => isNull(input, `${label}: Hourly Rate Not Provided`),
  
    () => isNumber(input, `${label}: Hourly Rate Must Be A Number`),
  
    () => inRange(input, 0, 1000, `${label}: Hourly Rate Cannot Exceed 1000`),
  
    () => isValidDecimal(input, 2, 1000, `${label}: Hourly cannot have more than 2 decimal places or exceed 1000`)
  
]);

//Validate Address
const validateAddress = async (address, label = "Address") => {

    try {

      const valid = validate(address, [

        () => isNull(address, `${label}: Address Not Provided`),

        () => isString(address, `${label}: Address Must Be A String`),

        () => inRange(address.length, 5, 255, `${label}: Address must be 5–255 characters`),

        () => matches(address, /,\s*San\s+Jose,\s*(California|CA)/i, `${label}: Must Be In San Jose`)

      ]);
  
      if (!valid) return false;

    } catch (err) {

      logger.error(`Validation failed: ${err.message}`);

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
  
//Validate Robot Load
const validateRobotLoad = (input, label) => validate(input, [

  () => isNull(input, `${label}: Robot Load Not Provided`),

  () => isNumber(input, `${label}: Robot Load Must Be A Number`),

  () => inRange(input, 0, 200, `${label}: Robot Load Must Be Between 0 and 200`)

]);

//Validate Robot Status
const validateRobotStatus = (input, label) => validateEnum(input, ['En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired'], `${label}: Robot Status`);

//Validate Transaction Status
const validateTransactionStatus = (input, label) => validateEnum(input, ['In progress', 'Complete', 'Failed', 'Delivering', 'Pending Delivery'], `${label}: Transaction Status`);

//Validate Employee Status
const validateEmployeeStatus = (input, label) => validateEnum(input, ['Employed', 'Absence', 'Fired'], `${label}: Employee Status`);

//Validate Category
const validateCategory = (input, label) => validateEnum(input, ['Fresh Produce','Dairy and Eggs','Meat and Seafood','Frozen Foods','Bakery and Bread','Pantry Staples','Beverages','Snacks and Sweets','Health and Wellness'], `${label}: Category`);

//Validate Storage Requirement
const validateStorageRequirement = (input, label) => validateEnum(input, ['Frozen', 'Deep Frozen', 'Cryogenic', 'Refrigerated', 'Cool', 'Room Temperature', 'Ambient', 'Warm', 'Hot', 'Dry', 'Moist', 'Airtight', 'Dark Storage', 'UV-Protected', 'Flammable', 'Hazardous', 'Perishable', 'Non-Perishable'], `${label}: Storage Requirement`);

//Validate Search Term
const validateProduct = (input, label = "Product Name") => {

    return validate(input, [

      () => isNull(input, `${label} Not Provided`),

      () => isString(input, `${label} Must Be A String`),

      () => inRange(input.length, 1, 255, `${label} must be 1–255 characters`),

      () => matches(input, /^[a-zA-Z0-9\s]*$/, `${label} Contains Blacklisted Characters`)

    ]);

};




//---------------------------------------------------------------------------------------------------------------
// -------------------------------Composite Validations----------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------




//Validate Product Format
const insertFormat = (Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description) => {

    return (

        validateQuantity(Quantity, "Quantity") &&

        validateName(Distributor, "Distributor") &&

        validateWeight(Weight, "Weight") &&

        validateName(ProductName, "Product Name") &&

        validateCategory(Category, "Category") &&

        validateCost(SupplierCost, "Supplier Cost") &&

        validateCost(Cost, "Product Cost") &&

        validateFutureDate(Expiration, "Expiration Date") &&

        validateStorageRequirement(StorageRequirement, "Storage Requirement") &&

        validateDescription(Description, "Description")

    );

};

//Validate Robot Format
const validateRobot = (req, res, next) => {

    if(

        validateRegularID(req.body.RobotID, "RobotID") &&
    
        validateRobotLoad(req.body.CurrentLoad, "Robot's Current Load") &&
    
        validateRobotStatus(req.body.RobotStatus, "Robot's Status") &&
    
        validateFutureDate(req.body.Maintanence, "Robot's Maintanence Date") 

    ){
            
            next();

    }else{
            
            return res.status(statusCode.BAD_REQUEST).json({error:"Robot Format Invalid"})

    }

}

//Validate Employee Format
const employeeFormat = (req, res, next) => {

    if(!validateRegularID(req.body.UserID, "UserID")){

        return res.status(statusCode.BAD_REQUEST).json({error:"UserID Format Invalid"})

    }

    req.body.UserID = req.body.UserID.toLowerCase();

    const {UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    if(!validateName(UserNameFirst, "First Name")){

        return res.status(statusCode.BAD_REQUEST).json({error:"First Name Format Invalid"})

    }
    
    if(!validateName(UserNameLast, "Last Name")){

        return res.status(statusCode.BAD_REQUEST).json({error:"Last Name Format Invalid"})

    }

    if (!validatePhoneNumber(UserPhoneNumber, "Phone Number")) {

        return res.status(statusCode.BAD_REQUEST).json({error:"Phone Number Format Invalid"})
        
    }

    next();
    
}

//Validate Login Format
const loginFormat = (req,res,next) => {

    if (!validateRegularID(req.body.UserID, "UserID")){

        return res.status(statusCode.BAD_REQUEST).json({error:"Username Not Found"})

    }

    req.body.UserID = req.body.UserID.toLowerCase()

    if (!validatePassword(req.body.Password, "Password")) {

        return res.status(statusCode.BAD_REQUEST).json({error:"Password Not Found"})

    }

    next();

}

//Sign Up Format For User
const signUpFormat = (req, res, next) => {

    if (!validateRegularID(req.body.UserID, "UserID")) {

        return res.status(statusCode.BAD_REQUEST).json({error:"Username Format Illegal"})

    }

    req.body.UserID = req.body.UserID.toLowerCase();

    const { Password, UserNameFirst, UserNameLast, UserPhoneNumber } = req.body;

    if(!validateName(UserNameFirst, "First Name")){

        return res.status(statusCode.BAD_REQUEST).json({error:"First Name Format Invalid"})

    }

    if(!validateName(UserNameLast, "Last Name")){

        return res.status(statusCode.BAD_REQUEST).json({error:"Last Name Format Invalid"})

    }

    if (!validatePhoneNumber(UserPhoneNumber, "Phone Number")) {

        return res.status(statusCode.BAD_REQUEST).json({error:"Phone Number Format Invalid"})

    }

    if (!validatePassword(Password, "Password")) {

        return res.status(statusCode.BAD_REQUEST).json({ error: "Password Format Invalid" });

    }

    next();

}

//Validate Sign Up Format For Employee
const signUpFormatEmployee = async (req, res, next) => {

    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly,
        SupervisorID
    } = req.body;

    if(!validatePastDate(EmployeeHireDate, "EmployeeHireDate")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHireDate Format Invalid"})

    }

    if(!validatePastDate(EmployeeBirthDate, "EmployeeBirthDate")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeBirthDate Format Invalid"}) 

    }

    if(!validateEmployeeStatus(EmployeeStatus, "EmployeeStatus")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeStatus Format Invalid"})  

    }

    if(!validateName(EmployeeDepartment, "EmployeeDepartment")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeDepartment Format Invalid"})  

    }

    if(!validateEmployeeHourly(EmployeeHourly, "EmployeeHourly")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHourly Format Invalid"})

    }

    if(!validateID(SupervisorID, "SupervisorID")){

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

//Validate Sign Up Format For Manager
const signUpFormatManager = (req, res, next) => {

    const {
        EmployeeHireDate,
        EmployeeStatus,
        EmployeeBirthDate,
        EmployeeDepartment,
        EmployeeHourly
    } = req.body;

    
    if(!validatePastDate(EmployeeHireDate, "EmployeeHireDate")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHireDate Format Invalid"})

    }

    if(!validatePastDate(EmployeeBirthDate, "EmployeeBirthDate")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeBirthDate Format Invalid"}) 

    }

    if(!validateEmployeeStatus(EmployeeStatus, "EmployeeStatus")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeStatus Format Invalid"})  

    }

    if(!validateName(EmployeeDepartment, "EmployeeDepartment")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeDepartment Format Invalid"})    

    }

    if(!validateEmployeeHourly(EmployeeHourly, "EmployeeHourly")){

        return res.status(statusCode.BAD_REQUEST).json({error:"EmployeeHourly Format Invalid"})   

    }

    next();
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
    insertFormat,
    validateTransactionStatus,
    validateCost,
    validateWeight,
    validateFutureDate,
    validatePastDate,
    validatePhoneNumber,
    validateProduct
}