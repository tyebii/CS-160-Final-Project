export const validateDate = (input) => {

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (input == null){

        alert("No Date Found")

        return false

    } 

    if(!datePattern.test(input)){

        alert("Date Fails The Pattern xxxx-xx-xx")

        return false

    } 
    
    if(validateBlacklist(input)){

        alert("Blacklisted Characters Found")

        return false;

    } 

    const date = new Date(input);

    const timestamp = date.getTime();

    if (isNaN(timestamp)){

        alert("Not A Valid Date")

        return false;

    }

    return input === date.toISOString().slice(0, 10);

}

export const validateSpaces = (input) => {

    if(/\s/.test(input)){

        alert("Spaces Detected")

        return true 

    }

        return false

}

export const validateBlacklist = (input) => {

    if(/[<>;]/.test(input)){

        alert("Blacklisted Characters Detected")

        return true

    }

    return false

}

export const validateID = (input) => {

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (input == null){

        alert("Input Not Found")

        return false

    } 
    
    if(typeof input !== 'string'){

        alert("Must Be A String")

        return false

    } 
    
    if(validateBlacklist(input)){

        alert("Has Blacklisted Characters")

        return false

    }
    
    if(!uuidRegex.test(input)) {

        alert("Improper Format On ID")

        return false;

    }

    return true;

}

export const validateRegularID = (input) => {

    if (input == null) {

        alert("Input Not Found");

        return false;

    }

    if (typeof input !== 'string') {

        alert("Must Be A String");

        return false;

    }

    if (input.length < 5) {

        alert("Input Too Short (Minimum 5 Characters)");

        return false;

    }

    if (input.length > 255) {

        alert("Input Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        alert("Contains Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        alert("Has Blacklisted Characters");

        return false;

    }

    return true;

}


export const validateAddress = async (address) => {

    if (address == null) {

        alert("Address Not Found");

        return false;

    }

    if (typeof address !== "string") {

        alert("Address Must Be A String");

        return false;

    }

    if (address.length < 5) {

        alert("Address Too Short (Minimum 5 Characters)");

        return false;

    }

    if (address.length > 255) {

        alert("Address Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateBlacklist(address)) {

        alert("Address Has Blacklisted Characters");

        return false;

    }

    const regex = /,\s*San\s+Jose,\s*(California|CA)/i;

    if (!regex.test(address)) {

        alert("Must Be In San Jose");
        
        return false;

    }

    return true
    
};


export const validateQuantity = (input) => {

    if (input == null) {

        alert("Quantity Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        alert("Quantity Must Be A Number");

        return false;

    }

    if (input <= 0) {

        alert("Quantity Must Be Greater Than Zero");

        return false;

    }

    if (!Number.isInteger(input)) {

        alert("Quantity Must Be An Integer");

        return false;

    }

    return true;

}


export const validateRobotLoad = (input) => {

    if (input == null) {

        alert("Robot Load Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        alert("Robot Load Must Be A Number");

        return false;

    }

    if (input < 0) {

        alert("Robot Load Cannot Be Negative");

        return false;

    }

    return true;

}

export const validateRobotStatus = (input) => {

    const statusList = ['En Route', 'Broken', 'Maintenance', 'Charging', 'Free', 'Retired'];

    if (input == null) {

        alert("Robot Status Not Provided");

        return false;

    }

    if (typeof input !== 'string') {

        alert("Robot Status Must Be A String");

        return false;

    }

    if (!statusList.includes(input)) {

        alert(`Invalid Robot Status. Must be one of: ${statusList.join(', ')}`);

        return false;

    }

    return true;

}


export const validateFutureDate = (input) => {

    

    if (input == null) {

        alert("Date Not Provided");

        return false;

    }

    if (!validateDate((input))) {

        return false;

    }

    const date = new Date(input);

    const now = new Date();

    if (isNaN(date.getTime())) {

        alert("Invalid Date Value");

        return false;

    }

    if (date <= now) {

        alert("Date Must Be In The Future");

        return false;

    }

    return true;

}

export const validatePastDate = (input) => {

    if (input == null) {

        alert("Date Not Provided");

        return false;

    }

    if (!validateDate(input)) {

        alert("Invalid Date Format");

        return false;

    }

    const date = new Date(input);

    const now = new Date();

    if (isNaN(date.getTime())) {

        alert("Invalid Date Value");

        return false;

    }

    if (date > now) {

        alert("Date Must Be In The Past");

        return false;

    }

    return true;
}

export const validateRobot = (RobotID, CurrentLoad, RobotStatus, Maintanence) => {

      
    if(!validateRegularID(RobotID)){

        return false

    } 
    
    if(!validateRobotLoad(CurrentLoad)){

        return false

    } 
    
    if(!validateRobotStatus(RobotStatus)){

        return false

    } 

    if(!validateFutureDate(Maintanence)){

        return false

    }
    
    return true

}

export const validateName = (input) => {

    if (input == null) {

        alert("Name Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        alert("Name Must Be A String");

        return false;

    }

    if (input.trim() === "") {

        alert("Name Cannot Be Empty or Whitespace");

        return false;

    }

    if (input.length < 2) {

        alert("Name Too Short (Minimum 2 Characters)");

        return false;

    }

    if (input.length > 255) {

        alert("Name Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateBlacklist(input)) {

        alert("Name Contains Blacklisted Characters");

        return false;

    }

    return true;

}

export const validatePhoneNumber = (input) => {

    const regexNumber = /^1-\d{3}-\d{3}-\d{4}$/;

    if (input == null) {

        alert("Phone Number Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        alert("Phone Number Must Be A String");

        return false;

    }

    if (validateSpaces(input)) {

        alert("Phone Number Cannot Contain Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        alert("Phone Number Contains Blacklisted Characters");

        return false;

    }

    if (!input.match(regexNumber)) {

        alert("Invalid Phone Number Format. Must be in the format: 1-XXX-XXX-XXXX");

        return false;

    }

    return true;

}

export const employeeFormat = (UserID, UserNameFirst, UserNameLast, UserPhoneNumber) => {

    if(!validateRegularID(UserID)){

        return false

    }

    if(!validateName(UserNameFirst)){

        return false

    }
    
    if(!validateName(UserNameLast)){

        return false

    }

    if (!validatePhoneNumber(UserPhoneNumber)) {

        return false

    }

    return true

}

export const validatePassword = (input) => {

    if (input == null) {

        alert("Password Not Provided");

        return false;

    }

    if (typeof input !== 'string') {

        alert("Password Must Be A String");

        return false;

    }

    if (input.length < 7) {

        alert("Password Too Short (Minimum 7 Characters)");

        return false;

    }

    if (input.length > 255) {

        alert("Password Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        alert("Password Cannot Contain Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        alert("Password Contains Blacklisted Characters");

        return false;

    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!input.match(regexPassword)) {

        alert("Password Must Contain At Least One Lowercase Letter, One Uppercase Letter, One Number, and One Special Character");
        
        return false;

    }

    return true;

}


export const loginFormat = (UserID,Password) => {

    if (!validateRegularID(UserID)){
        return false
    }

    if (!validatePassword(Password)){
        return false
    }

    return true 
    
}

export const signUpFormat = (UserID, Password, UserNameFirst, UserNameLast, UserPhoneNumber ) => {

    if (!validateRegularID(UserID)){
        return false
    }

    if(!validateName(UserNameFirst)){
        return false
    }

    if(!validateName(UserNameLast)){
        return false
    }

    if (!validatePhoneNumber(UserPhoneNumber)) {
        return false
    }

    if (!validatePassword(Password)) {
        return false
    }

    return true

}

export const validateTransactionStatus = (input) => {

    const validStorage = ['In progress','Complete','Failed', 'Delivering', 'Pending Delivery'];

    if (input == null) {

        return false;

    }

    if (typeof input !== "string") {

        return false;

    }

    if (!validStorage.includes(input)) {

        return false;

    }

    return true;
}


export const validateEmployeeStatus = (input) => {

    const validStatuses = ["Employed", "Absence", "Fired"];

    if (input == null) {

        alert("Employee Status Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        alert("Employee Status Must Be A String");

        return false;

    }

    if (!validStatuses.includes(input)) {

        alert(`Invalid Employee Status. Must be one of: ${validStatuses.join(", ")}`);

        return false;

    }

    return true;

}


export const validateEmployeeHourly = (input) => {

    if (input == null) {

        alert("Hourly Rate Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        alert("Hourly Rate Must Be A Number");

        return false;

    }

    if (input < 0) {

        alert("Hourly Rate Cannot Be Negative");

        return false;

    }

    return true;

}


export const signUpFormatEmployee = (
    EmployeeHireDate,
    EmployeeStatus,
    EmployeeBirthDate,
    EmployeeDepartment,
    EmployeeHourly,
    SupervisorID
) => {

    if (!validatePastDate(EmployeeHireDate)) {

        return false;

    }

    if (!validatePastDate(EmployeeBirthDate)) {

        return false;

    }

    if (!validateEmployeeStatus(EmployeeStatus)) {

        return false;

    }

    if (!validateName(EmployeeDepartment)) {

        return false;

    }

    if (!validateEmployeeHourly(EmployeeHourly)) {

        return false;

    }

    if (!validateID(SupervisorID)) {

        return false;

    }

    return true;

}


export const signUpFormatManager = (
    EmployeeHireDate,
    EmployeeStatus,
    EmployeeBirthDate,
    EmployeeDepartment,
    EmployeeHourly
) => {

    if (!validatePastDate(EmployeeHireDate)) {
        return false;
    }

    if (!validatePastDate(EmployeeBirthDate)) {
        return false;
    }

    if (!validateEmployeeStatus(EmployeeStatus)) {
        return false;
    }

    if (!validateName(EmployeeDepartment)) {
        return false;
    }

    if (!validateEmployeeHourly(EmployeeHourly)) {
        return false;
    }

    return true;
}

export const validateCategory = (input) => {

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

        alert("Category Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        alert("Category Must Be A String");

        return false;

    }

    if (!categoryEnum.includes(input)) {

        alert(`Invalid Category. Must be one of: ${categoryEnum.join(", ")}`);

        return false;

    }

    return true;

}


export const validateProduct = (input) => {

    if (input == null) {

        alert("Product Name Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        alert("Product Name Must Be A String");

        return false;

    }

    if (input.length == 0) {

        alert("Product Name Cannot Be Empty");

        return false;

    }

    if (input.length > 255) {

        alert("Product Name Too Long (Maximum 255 Characters)");

        return false;

    }

    if (validateSpaces(input)) {

        alert("Product Name Cannot Contain Spaces");

        return false;

    }

    if (validateBlacklist(input)) {

        alert("Product Name Contains Blacklisted Characters");

        return false;

    }

    return true;

}


export const validateWeight = (input) => {

    if (input == null) {

        alert("Weight Not Provided");

        return false;

    }

    if (typeof input !== 'number') {

        alert("Weight Must Be A Number");

        return false;

    }

    if (input <= 0) {

        alert("Weight Must Be Greater Than Zero");

        return false;

    }

    return true;

}


export const validateCost = (input) => {
    if (input == null) {
        alert("Cost Not Provided");
        return false;
    }

    if (typeof input !== 'number') {
        alert("Cost Must Be A Number");
        return false;
    }

    if (input <= 0) {
        alert("Cost Must Be Greater Than Zero");
        return false;
    }

    return true;
}


export const validateStorageRequirement = (input) => {

    const validStorage = [
        'Frozen', 'Deep Frozen', 'Cryogenic', 'Refrigerated', 'Cool', 
        'Room Temperature', 'Ambient', 'Warm', 'Hot', 'Dry', 'Moist', 
        'Airtight', 'Dark Storage', 'UV-Protected', 'Flammable', 'Hazardous', 
        'Perishable', 'Non-Perishable'
    ];

    if (input == null) {

        alert("Storage Requirement Not Provided");

        return false;

    }

    if (typeof input !== "string") {

        alert("Storage Requirement Must Be A String");

        return false;

    }

    if (!validStorage.includes(input)) {

        alert(`Invalid Storage Requirement. Must be one of: ${validStorage.join(", ")}`);

        return false;

    }

    return true;

}

export const insertFormat = (Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description) => {

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


