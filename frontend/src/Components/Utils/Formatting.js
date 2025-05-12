//---------------------------------------------------------------------------------------------------------------
// -------------------------------Helper Functions For Generalized Validation------------------------------------
//---------------------------------------------------------------------------------------------------------------



//Validate Item Belonging To A List
export const validateEnum = (input, list, label) => validate(input, [

  () => isNull(input, `${label}: ${label} Not Provided`),

  () => isString(input, `${label}: ${label} Must Be A String`),

  () => inList(input, list, `${label}: Invalid ${label}. Must be one of: ${list.join(', ')}`)

]);

//Checks if the value is null
const isNull = (value, message) => { if (value == null) throw new Error(message); };

//Checks if the vvalue is a string
const isString = (value, message) => { if (typeof value !== 'string') throw new Error(message); };

//Checks if the value is a number
const isNumber = (value, message) => { if (typeof value !== 'number') throw new Error(message); };

//Checks if the value is not just whitespace
const isBlank = (value, message) => {if (/^\s*$/.test(value)) throw new Error(message)} ;

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

  console.log(value, today);

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

  console.log(value, today);

  if (value <= today) {

    throw new Error(message);

  }

};

//Checks the input against the selected validators
const validate = (input, validators) => {

  try {

    for (const func of validators) func();

    return true;

  } catch (err) {

    alert(err.message);

    return false;

  }

};




//---------------------------------------------------------------------------------------------------------------
// -------------------------------Field Validations--------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------

//Validate Regular ID
export const validateRegularID = (input, label) => validate(input, [

  () => isNull(input, `${label}: ID Input Not Found`),

  () => isString(input, `${label}: ID Must Be A String`),

  () => inRange(input.length, 5, 255, `${label}: ID Input must be 5–255 characters`),

  () => hasNoSpaces(input, `${label}: Contains Spaces`),

  () => matches(input, /^[a-zA-Z0-9]+$/, `${label}: ID Must be alphanumeric`)

]);

//Validate UUID
export const validateID = (input, label) => validate(input, [

  () => isNull(input, `${label}: Input Not Found`),

  () => isString(input, `${label}: Must Be A String`),

  () => isUUID(input, `${label}: Improper Format On ID`)

]);

//Validate Date
export const validateDate = (input, label) => validate(input, [

  () => isNull(input, `${label}: No Date Found`),

  () => isISODate(input, `${label}: Date Fails The Pattern xxxx-xx-xx`)

]);

//Validate Future Date
export const validateFutureDate = (input, label) => validate(input, [

  () => isNull(input, `${label}: Date Not Provided`),

  () => isISODate(input, `${label}: Date Fails The Pattern xxxx-xx-xx`),

  () => isFutureDate(input, `${label}: Date Must Be In The Future`)

]);

//Validate Past Date
export const validatePastDate = (input, label) => validate(input, [

  () => isNull(input, `${label}: Date Not Provided`),

  () => isISODate(input, `${label}: Date Fails The Pattern xxxx-xx-xx`),

  () => isPastDate(input, `${label}: Date Must Be In The Past`)

]);

//Validate Name
export const validateName = (input, label) => validate(input, [

  () => isNull(input, `${label}: Name Not Provided`),

  () => isString(input, `${label}: Name Must Be A String`),

  () => inRange(input.trim().length, 2, 255, `${label}: Name must be 2–255 characters`),

  () => matches(input, /^[a-zA-Z]+(?: [a-zA-Z]+)*$/, `${label}: Name must be alphabetical`)

]);

//Validate Description
export const validateDescription = (input, label) => validate(input, [

  () => isNull(input, `${label}: Description Not Provided`),

  () => isString(input, `${label}: Description Must Be A String`),

  () => inRange(input.trim().length, 2, 255, `${label}: Description must be 2–255 characters`),

  () => matches(input, /^[a-zA-Z0-9\s.,'\-?!]*$/, `${label}: Description must be alphabetical`)

]);

//Validate Phone Number
export const validatePhoneNumber = (input, label) => validate(input, [

  () => isNull(input, `${label}: Phone Number Not Provided`),

  () => isString(input, `${label}: Phone Number Must Be A String`),

  () => hasNoSpaces(input, `${label}: Phone Number Cannot Contain Spaces`),

  () => matches(input, /^\d{11}$/, `${label}: Invalid Phone Number Format. Must be in the format: XXXXXXXXXXX`)

]);

//Validate Password
export const validatePassword = (input, label) => validate(input, [

  () => isNull(input, `${label}: Password Not Provided`),

  () => isString(input, `${label}: Password Must Be A String`),

  () => inRange(input.length, 8, 255, `${label}: Password must be 8–255 characters`),

  () => hasNoSpaces(input, `${label}: Password Cannot Contain Spaces`),

  () => matches(input, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, `${label}: Password must contain upper, lower, number, and special character`)
]);

//Validate Quantity
export const validateQuantity = (input, label) => validate(input, [

  () => isNull(input, `${label}: Quantity Not Provided`),

  () => isNumber(input, `${label}: Quantity Must Be A Number`),

  () => isInteger(input, `${label}: Quantity Must Be an Integer`),

  () => inRange(input, 1, 5000, `${label}: Quantity Must Be Between 1 and 5000`)

]);

//Validate Weight
export const validateWeight = (input, label) => validate(input, [

    () => isNull(input, `${label}: Weight Not Provided`),

    () => isNumber(input, `${label}: Weight Must Be A Number`),

    () => inRange(input, 0.01, 1000, `${label}: Weight Must Be Between 0.01 and 1000`),

    () => isValidDecimal(input, 2, 1000, `${label}: Weight cannot have more than 2 decimal places or exceed 1000`)

  ]);

//Validate Cost
export const validateCost = (input, label) => validate(input, [

  () => isNull(input, `${label}: Cost Not Provided`),

  () => isNumber(input, `${label}: Cost Must Be A Number`),

  () => inRange(input, 0.01, 100000, `${label}: Cost Must Be Between 0.01 and 100000`),

  () => isValidDecimal(input, 2, 100000, `${label}: Cost cannot have more than 2 decimal places or exceed 100000`)

]);

//Validate Employee Hourly
export const validateEmployeeHourly = (input, label) => validate(input, [

  () => isNull(input, `${label}: Hourly Rate Not Provided`),

  () => isNumber(input, `${label}: Hourly Rate Must Be A Number`),

  () => inRange(input, 0, 1000, `${label}: Hourly Rate Cannot Exceed 1000`),

  () => isValidDecimal(input, 2, 1000, `${label}: Hourly cannot have more than 2 decimal places or exceed 1000`)

]);

//Validate Address
export const validateAddress = (input, label) => validate(input, [

  () => isNull(input, `${label}: Address Not Provided`),

  () => isString(input, `${label}: Address Must Be A String`),

  () => inRange(input.length, 5, 255, `${label}: Address must be 5–255 characters`),

  () => matches(input, /,\s*San\s+Jose,\s*(California|CA)/i, `${label}: Must Be In San Jose`)

]);

//Validate Robot Load
export const validateRobotLoad = (input, label) => validate(input, [

  () => isNull(input, `${label}: Robot Load Not Provided`),

  () => isNumber(input, `${label}: Robot Load Must Be A Number`),

  () => inRange(input, 0, 200, `${label}: Robot Load Must Be Between 0 and 200`)

]);

//Validate Robot Status
export const validateRobotStatus = (input, label) => validateEnum(input, ['En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired'], `${label}: Robot Status`);

//Validate Transaction Status
export const validateTransactionStatus = (input, label) => validateEnum(input, ['In progress', 'Complete', 'Failed', 'Delivering', 'Pending Delivery'], `${label}: Transaction Status`);

//Validate Employee Status
export const validateEmployeeStatus = (input, label) => validateEnum(input, ['Employed', 'Absence', 'Fired'], `${label}: Employee Status`);

//Validate Category
export const validateCategory = (input, label) => validateEnum(input, ['Fresh Produce','Dairy and Eggs','Meat and Seafood','Frozen Foods','Bakery and Bread','Pantry Staples','Beverages','Snacks and Sweets','Health and Wellness'], `${label}: Category`);

//Validate Storage Requirement
export const validateStorageRequirement = (input, label) => validateEnum(input, ['Frozen', 'Deep Frozen', 'Cryogenic', 'Refrigerated', 'Cool', 'Room Temperature', 'Ambient', 'Warm', 'Hot', 'Dry', 'Moist', 'Airtight', 'Dark Storage', 'UV-Protected', 'Flammable', 'Hazardous', 'Perishable', 'Non-Perishable'], `${label}: Storage Requirement`);

//Validate Search Term
export const validateProduct = (input, label = "Product Name") => {

    return validate(input, [

      () => isNull(input, `${label} Not Provided`),

      () => isString(input, `${label} Must Be A String`),

      () => isBlank(input, `${label} Cannot Be Blank`), 

      () => inRange(input.length, 1, 255, `${label} must be 1–255 characters`),

      () => matches(input, /^[a-zA-Z0-9\s]*$/, `${label} Contains Blacklisted Characters. Must Be Alphanumeric`),

    ]);

};



//---------------------------------------------------------------------------------------------------------------
// -------------------------------Composite Validations----------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------




//Validate Robot
export const validateRobot = (RobotID, CurrentLoad, RobotStatus, Maintanence) => {

  return (

    validateRegularID(RobotID, "RobotID") &&

    validateRobotLoad(CurrentLoad, "Robot's Current Load") &&

    validateRobotStatus(RobotStatus, "Robot's Status") &&

    validateFutureDate(Maintanence, "Robot's Maintanence Date") 

  );
  
};

//Validate Employee Format
export const employeeFormat = (UserID, UserNameFirst, UserNameLast, UserPhoneNumber) => {

    return (

        validateRegularID(UserID, "UserID") &&

        validateName(UserNameFirst, "User's First Name") &&

        validateName(UserNameLast, "User's First Name") &&

        validatePhoneNumber(UserPhoneNumber, "User's Phone Number")

    );

};

//Validate Login Format
export const loginFormat = (UserID, Password) => {

    return (

        validateRegularID(UserID, "UserID") &&

        validatePassword(Password, "Password")

    );

};

//Validate User Signup Format
export const signUpFormat = (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber) => {

    return (

        validateRegularID(UserID, "UserID") &&

        validatePassword(Password, "Password") &&

        validateName(UserNameFirst, "User's First Name") &&

        validateName(UserNameLast, "User's Last Name") &&

        validatePhoneNumber(UserPhoneNumber, "User's Phone Number")

    );

};

//Validate Employee Signup Format
export const signUpFormatEmployee = (EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) => {

    return (

        validatePastDate(EmployeeHireDate, "User's Hire Date") &&

        validateEmployeeStatus(EmployeeStatus, "Employee's Status") &&

        validatePastDate(EmployeeBirthDate, "Employee's Birthdate") &&

        validateName(EmployeeDepartment, "Department") &&

        validateEmployeeHourly(EmployeeHourly, "Hourly Pay") &&

        validateID(SupervisorID, "SupervisorID")

    );

};

//Validate Manager Signup Format
export const signUpFormatManager = (EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly) => {

    return (

        validatePastDate(EmployeeHireDate, "User's Hire Date") &&

        validateEmployeeStatus(EmployeeStatus, "Employee's Status") &&

        validatePastDate(EmployeeBirthDate, "Employee's Birthdate") &&

        validateName(EmployeeDepartment, "Department") &&

        validateEmployeeHourly(EmployeeHourly, "Hourly Pay")

    );

};

//Validate Product Format
export const insertFormat = (Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description) => {

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
