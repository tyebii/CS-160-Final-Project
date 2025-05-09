//---------------------------------------------------------------------------------------------------------------
// -------------------------------Helper Functions For Generalized Validation------------------------------------
//---------------------------------------------------------------------------------------------------------------




//Checks if the value is null
const isNull = (value, message) => { if (value == null) throw new Error(message); };

//Checks if the vvalue is a string
const isString = (value, message) => { if (typeof value !== 'string') throw new Error(message); };

//Checks if the value is a number
const isNumber = (value, message) => { if (typeof value !== 'number') throw new Error(message); };

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

//Checks if the value is a valid date
const isISODate = (value, message) => {

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) throw new Error(message);

  const date = new Date(value);

  if (isNaN(date.getTime())) throw new Error('Not a valid date');

  const normalized = date.toISOString().slice(0, 10);

  if (value !== normalized) throw new Error(message);

};

//Checks if the value is a past date
const isPastDate = (value, message) => { if (new Date(value) > new Date()) throw new Error(message); };

//Checks if the value is a future date
const isFutureDate = (value, message) => { if (new Date(value) <= new Date()) throw new Error(message); };

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




// Validate IDs
export const validateRegularID = (input) => validate(input, [

  () => isNull(input, 'ID Input Not Found'),

  () => isString(input, 'ID Must Be A String'),

  () => inRange(input.length, 5, 255, 'ID Input must be 5–255 characters'),

  () => hasNoSpaces(input, 'Contains Spaces'),

  () => matches(input, /^[a-zA-Z0-9]+$/, 'ID Must be alphanumeric')

]);

//Validate UUIDs
export const validateID = (input) => validate(input, [

  () => isNull(input, 'Input Not Found'),

  () => isString(input, 'Must Be A String'),

  () => isUUID(input, 'Improper Format On ID')

]);

//Validate Date
export const validateDate = (input) => validate(input, [

  () => isNull(input, 'No Date Found'),

  () => isISODate(input, 'Date Fails The Pattern xxxx-xx-xx')

]);

//Validate Furture Date
export const validateFutureDate = (input) => validate(input, [

  () => isNull(input, 'Date Not Provided'),

  () => isISODate(input, 'Date Fails The Pattern xxxx-xx-xx'),

  () => isFutureDate(input, 'Date Must Be In The Future')

]);

//Validate Past Date
export const validatePastDate = (input) => validate(input, [

  () => isNull(input, 'Date Not Provided'),

  () => isISODate(input, 'Date Fails The Pattern xxxx-xx-xx'),

  () => isPastDate(input, 'Date Must Be In The Past')

]);

//Validate Name
export const validateName = (input) => validate(input, [

  () => isNull(input, 'Name Not Provided'),

  () => isString(input, 'Name Must Be A String'),

  () => inRange(input.trim().length, 2, 255, 'Name must be 2–255 characters'),

  () => matches(input, /^[a-zA-Z]+$/, 'Name must be alphabetical')

]);

//Validate Phone Number
export const validatePhoneNumber = (input) => validate(input, [

  () => isNull(input, 'Phone Number Not Provided'),

  () => isString(input, 'Phone Number Must Be A String'),

  () => hasNoSpaces(input, 'Phone Number Cannot Contain Spaces'),

  () => matches(input, /^\d{11}$/, "Invalid Phone Number Format. Must be in the format: XXXXXXXXXXX")

]);

//Validate Password
export const validatePassword = (input) => validate(input, [

  () => isNull(input, 'Password Not Provided'),

  () => isString(input, 'Password Must Be A String'),

  () => inRange(input.length, 8, 255, 'Password must be 8–255 characters'),

  () => hasNoSpaces(input, 'Password Cannot Contain Spaces'),

  () => matches(input, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, 'Password must contain upper, lower, number, and special character')

]);

//Validate Quantity
export const validateQuantity = (input) => validate(input, [

  () => isNull(input, 'Quantity Not Provided'),

  () => isNumber(input, 'Quantity Must Be A Number'),

  () => inRange(input, 1, 5000, 'Quantity Must Be Between 1 and 5000')

]);

//Validate Weight
export const validateWeight = (input) => validate(input, [

  () => isNull(input, 'Weight Not Provided'),

  () => isNumber(input, 'Weight Must Be A Number'),

  () => inRange(input, 0.01, 1000, 'Weight Must Be Between 0.01 and 1000')

]);

//Validate Cost
export const validateCost = (input) => validate(input, [

  () => isNull(input, 'Cost Not Provided'),

  () => isNumber(input, 'Cost Must Be A Number'),

  () => inRange(input, 0.01, 100000, 'Cost Must Be Between 0.01 and 100000')

]);

//Validate Employee Hourly
export const validateEmployeeHourly = (input) => validate(input, [

  () => isNull(input, 'Hourly Rate Not Provided'),

  () => isNumber(input, 'Hourly Rate Must Be A Number'),

  () => inRange(input, 0, 1000, 'Hourly Rate Cannot Exceed 1000')

]);

//Validate Item Belonging To A List
export const validateEnum = (input, list, label) => validate(input, [

  () => isNull(input, `${label} Not Provided`),

  () => isString(input, `${label} Must Be A String`),

  () => inList(input, list, `Invalid ${label}. Must be one of: ${list.join(', ')}`)

]);

//Validate Address
export const validateAddress = (input) => validate(input, [

  () => isNull(input, 'Address Not Provided'),

  () => isString(input, 'Address Must Be A String'),

  () => inRange(input.length, 5, 255, 'Address must be 5–255 characters'),

  () => matches(input, /,\s*San\s+Jose,\s*(California|CA)/i, 'Must Be In San Jose')

]);

//Validate Robot Load
export const validateRobotLoad = (input) => validate(input, [

  () => isNull(input, 'Robot Load Not Provided'),

  () => isNumber(input, 'Robot Load Must Be A Number'),

  () => inRange(input, 0, 200, 'Robot Load Must Be Between 0 and 200')

]);

//Validate Robot Status
export const validateRobotStatus = (input) => validateEnum(input, ['En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired'], 'Robot Status');

//Validate Transaction Status
export const validateTransactionStatus = (input) => validateEnum(input, ['In progress','Complete','Failed', 'Delivering', 'Pending Delivery'], 'Transaction Status');

//Validate Employee Status
export const validateEmployeeStatus = (input) => validateEnum(input, ['Employed', 'Absence', 'Fired'], 'Employee Status');

//Validate Category
export const validateCategory = (input) => validateEnum(input, ['Fresh Produce','Dairy and Eggs','Meat and Seafood','Frozen Foods','Bakery and Bread','Pantry Staples','Beverages','Snacks and Sweets','Health and Wellness'], 'Category');

//Validate Storage Requirement
export const validateStorageRequirement = (input) => validateEnum(input, ['Frozen', 'Deep Frozen', 'Cryogenic', 'Refrigerated', 'Cool', 'Room Temperature', 'Ambient', 'Warm', 'Hot', 'Dry', 'Moist', 'Airtight', 'Dark Storage', 'UV-Protected', 'Flammable', 'Hazardous', 'Perishable', 'Non-Perishable'], 'Storage Requirement');

//Validate Robot
export const validateRobot = (RobotID, CurrentLoad, RobotStatus, Maintanence) => {

    return (

      validateRegularID(RobotID) &&

      validateRobotLoad(CurrentLoad) &&

      validateRobotStatus(RobotStatus) &&

      validateFutureDate(Maintanence)

    );
    
};




//---------------------------------------------------------------------------------------------------------------
// -------------------------------Composite Validations----------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------




//Validate Employee Format
export const employeeFormat = (UserID, UserNameFirst, UserNameLast, UserPhoneNumber) => {

    return (

        validateRegularID(UserID) &&

        validateName(UserNameFirst) &&

        validateName(UserNameLast) &&

        validatePhoneNumber(UserPhoneNumber)

    );

};

//Validate Login Format
export const loginFormat = (UserID, Password) => {

    return (

        validateRegularID(UserID) &&

        validatePassword(Password)

    );

};

//Validate User Signup Format
export const signUpFormat = (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber) => {

    return (

        validateRegularID(UserID) &&

        validatePassword(Password) &&

        validateName(UserNameFirst) &&

        validateName(UserNameLast) &&

        validatePhoneNumber(UserPhoneNumber)

    );

};

//Validate Employee Signup Format
export const signUpFormatEmployee = (EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly, SupervisorID) => {

    return (

        validatePastDate(EmployeeHireDate) &&

        validateEmployeeStatus(EmployeeStatus) &&

        validatePastDate(EmployeeBirthDate) &&

        validateName(EmployeeDepartment) &&

        validateEmployeeHourly(EmployeeHourly) &&

        validateID(SupervisorID)

    );

};

//Validate Manager Signup Format
export const signUpFormatManager = (EmployeeHireDate, EmployeeStatus, EmployeeBirthDate, EmployeeDepartment, EmployeeHourly) => {

    return (

        validatePastDate(EmployeeHireDate) &&

        validateEmployeeStatus(EmployeeStatus) &&

        validatePastDate(EmployeeBirthDate) &&

        validateName(EmployeeDepartment) &&

        validateEmployeeHourly(EmployeeHourly)

    );

};

//Validate Product Format
export const insertFormat = (Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description) => {

    return (

        validateQuantity(Quantity) &&

        validateName(Distributor) &&

        validateWeight(Weight) &&

        validateName(ProductName) &&

        validateCategory(Category) &&

        validateCost(SupplierCost) &&

        validateCost(Cost) &&

        validateFutureDate(Expiration) &&

        validateStorageRequirement(StorageRequirement) &&

        validateName(Description)

    );

};
