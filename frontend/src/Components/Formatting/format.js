import { use } from "react";

function isValidDate(input) {
    //Regex Check
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(input)) return false;

    //See if acts as a valid date
    const date = new Date(input);
    const timestamp = date.getTime();
    if (isNaN(timestamp)) return false;
  
    return input === date.toISOString().slice(0, 10);
}

const hasSpaces = (input) => /\s/.test(input);

export const formatItemView = (formData,file, edit) => {
    if(file==null){
        alert("There Must Be A File")
        return false
    }

    if(formData.Distributor==null){
        alert("Distributor Must Have Value")
        return false
    }

    if(formData.Quantity==null){
        alert("Quantity Must Have A Value")
        return false
    }

    if(formData.Expiration==null){
        alert("There Must Be An Expiration Date")
        return false
    }

    if(formData.StorageRequirement==null){
        alert("There Must Be A Storage Requirement")
        return false
    }

    if(formData.ItemID==null && edit){
        alert("There Must Be An ItemID")
        return false
    }

    if(formData.Cost==null){
        alert("There Must Be A Cost")
        return false
    }

    if(formData.Weight==null){
        alert("There Must Be A Weight")
        return false
    }

    if(formData.Category==null){
        alert("There Must Be A Category")
        return false
    }

    if(formData.SupplierCost==null){
        alert("There Must Be A Supplier Cost")
        return false
    }

    if(formData.Description==null){
        alert("There Must Be A Description")
        return false
    }

    if(typeof formData.ProductName != 'string'){
        alert("Product name must be of type string")
        return false
    }

    if(typeof formData.Distributor != 'string'){
        alert("Distributor must be of type string")
        return false
    }

    if(typeof formData.Quantity != 'number'){
        alert("Quantity must be of type number")
        return false
    }

    if(typeof formData.Expiration != 'string'){
        alert("Expiration must be of type string")
        return false
    }

    if(typeof formData.StorageRequirement != 'string'){
        alert("Storage Requirement must be of type string")
        return false
    }

    if(edit && typeof formData.ItemID != 'string'){
        alert("ItemID must be of type string")
        return false
    }

    if(typeof formData.Cost != 'number'){
        alert("Cost must be of type number")
        return false
    }

    if(typeof formData.Weight != 'number'){
        alert("Weight must be of type number")
        return false
    }

    if(typeof formData.Category != 'string'){
        alert("Category must be of type string")
        return false
    }

    if(typeof formData.SupplierCost != 'number'){
        alert("Supplier Cost must be of type number")
        return false
    }

    if(typeof formData.Description != 'string'){
        alert("Description must be of type string")
        return false
    }

    const productNameTrim = formData.ProductName.trim() 
    if(productNameTrim < 2){
        alert("Product Name Must Have At Least 2 Non-space Characters")
        return false
    }

    if(productNameTrim > 255){
        alert("Product Name Must Have Less Than 256 Characters")
        return false
    }

    const distributorTrim = formData.Distributor.trim()
    if(distributorTrim < 2){
        alert("Distributor Must Have At Least 2 Non-space Characters")
        return false
    }

    if(distributorTrim > 255){
        alert("Distributor Must Have Less Than 256 Characters")
        return false
    }

    const descriptionTrim = formData.Description.trim()
    if(descriptionTrim < 2){
        alert("Description Must Have At Least 2 Non-space Characters")
        return false
    }

    if(descriptionTrim > 255){
        alert("Description Must Have Less Than 256 Characters")
        return false
    }
    

    if(formData.Quantity < 0){
        alert("Quantity Can't Be Negative")
        return false
    }

    if(formData.Cost < 0){
        alert("Cost Can't Be Negative")
        return false
    }

    if(formData.SupplierCost < 0){
        alert("Supplier Cost Can't Be Negative")
        return false
    }

    if(formData.Weight <= 0){
        alert("Weight Can't Be Negative or Zero")
        return false
    }

    if(!isValidDate(formData.Expiration)){
        alert("Must Be A Valid Date")
        return false
    }

    if(new Date(formData.Expiration)<new Date()){
        alert("Expiration can't be in the past")
        return false
    }

    const setStorage = new Set(['Frozen','Deep Frozen','Cryogenic','Refrigerated','Cool','Room Temperature','Ambient','Warm','Hot','Dry','Moist','Airtight','Dark Storage','UV-Protected','Flammable','Hazardous','Perishable','Non-Perishable'])

    if(!setStorage.has(formData.StorageRequirement)){
        alert("Must Be A Valid Storage Requirement")
        return false
    }

    const setCategories = new Set(['Fresh Produce', 'Dairy and Eggs', 'Meat and Seafood', 'Frozen Foods', 'Bakery and Bread', 'Pantry Staples', 'Beverages', 'Snacks and Sweets', 'Health and Wellness'])
    if(!setCategories.has(formData.Category)){
        alert("Must Be A Valid Category")
        return false
    }

    if(edit && hasSpaces(formData.ItemID)){
        alert("ItemID ID Must Not Contain Spaces")
        return false
    }
    
    if(edit && formData.ItemID.length < 5){
        alert("ItemID ID Must Be At Least 5 Characters Long")
        return false
    }

    if(edit && formData.ItemID.length > 255){
        alert("ItemID Must Be Less Than or Equal To 255 Characters Long")
        return false
    }

    return true
}


export const formatLogin = (username,password)=>{
    if(hasSpaces(username) || hasSpaces(password) || username.length==0 || username.length>255 || password==0 || password.length>255){
        alert("Invalid Format")
        return false
    }

    return true
}


//Check The Format
export const formatRobot = (RobotID, RobotStatus, Maintanence, Speed, BatteryLife) =>{

    if(RobotID==null){
        alert("No Robot ID")
        return false
    }

    if(RobotStatus  == null){
        alert("No Robot Status")
        return false
    }

    if(Maintanence == null){
        alert("No Maintanence")
        return false
    }

    if(Speed == null){
        alert("No Speed")
        return false
    }

    if(BatteryLife==null){
        alert("No Battery Life")
        return false
    }
    
    //Make Sure They're Right
    if(RobotID==""){
        alert("Please Fill In Robot ID")
        return false
    }

    if(RobotStatus==""){
        alert("Please Fill In Robot Status")
        return false
    }
    
    if(Maintanence==""){
        alert("Please Fill In Maintenance Date")
        return false;
    }

    if(Speed==0){
        alert("Please Fill In Speed Above 0")
        return false;
    } 
    
    if(BatteryLife==null){
        alert("Please Fill In Battery Life")
        return false;
    }

    if(RobotID.trim().length < 5){
        alert("Robot ID Must Be At Least 5 Characters Long")
        return false;
    }

    if(Speed < 0 || Speed > 100){
        alert("Speed Must Be Between 0 and 100")
        return false;
    }

    if(BatteryLife < 0 || BatteryLife > 100){
        alert("Battery Life Must Be Between 0 and 100")
        return false;
    }

    if(RobotID.trim().length < 5){
        alert("Robot ID Must Be At Least 5 Characters Long")
        return false;
    }

    if(Speed < 0 || Speed > 100){
        alert("Speed Must Be Between 0 and 100")
        return false;
    }

    if(BatteryLife < 0 || BatteryLife > 100){
        alert("Battery Life Must Be Between 0 and 100")
        return false;
    }

    const set = new Set(['Broken','Maintenance','Charging','Free']);
    if(!set.has(RobotStatus)){
        alert("Invalid Robot Status")
        return false;
    }

    if(new Date(Maintanence) < new Date()){
        alert("Maintenance Date Cannot Be In The Past")
        return false;
    }

    return true;
}