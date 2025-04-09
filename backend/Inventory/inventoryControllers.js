//Import the database connection pool
const pool = require('../Database Pool/DBConnections')
const multer = require('multer');
const path = require('path');

//Call back for category name queries
const categoryQuery = (req, res) => {
    //Get the name of the category
    let {name} = req.params;
    
    //Replace the delimiters with spaces
    name = name.replace(/-/g, " ");

    //Check if value is in set 
    if(!searchCategoryFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }

    //Get the items that match the category. This is catered toward customer
    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE category = ?', [name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        
        for(let i = 0; i < results.length; i++){
            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;
        }

        res.status(200).json(results);
    });
};

//Call back for product name queries
const productQueryName = (req, res) => {
    //Get the name of the product
    let {name} = req.params;
    //Replace delimitters with spaces
    name = name.replace(/-/g, " ");

    //Makes sure input is proper
    if(!searchProductNameFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }

    //Queries for items that have the name in it
    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        for(let i = 0; i < results.length; i++){
            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;
        }
        res.status(200).json(results);
    });
}

//Call back for category name queries
const categoryQueryEmployee = (req, res) => {
    //Get category name
    let {name} = req.params;
    
    //Replace delimitters with spaces
    name = name.replace(/-/g, " ");

    //Validate the input 
    if(!searchCategoryFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }

    //Get all information about items in category
    pool.query('SELECT * FROM inventory WHERE category = ?', [name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        for(let i = 0; i < results.length; i++){
            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;
        }
        res.status(200).json(results);
    });
};

//Call back for product name queries
const productQueryNameEmployee = (req, res) => {
    //Get product name
    let {name} = req.params;

    //Replace delimitters with spaces
    name = name.replace(/-/g, " ");

    //Make sure that the input is sanitized
    if(!searchProductNameFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }

    //Get all information about items with name in it
    pool.query('SELECT * FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        for(let i = 0; i < results.length; i++){
            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;
        }
        res.status(200).json(results);
    });
}


//Call back for product id queries
const productQueryID = (req, res) => {
    //Get item id
    let {itemid} = req.params;

    //Query for items with that ID
    pool.query('SELECT * FROM inventory WHERE ItemID = ?', [itemid], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      for(let i = 0; i < results.length; i++){
        results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;
        }
        res.status(200).json(results);
    });
}

//Call back for product id queries
const productCustomerQueryID = (req, res) => {
    //Get item id
    let {itemid} = req.params;

    //Query for items with that ID
    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ItemID = ?', [itemid], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      for(let i = 0; i < results.length; i++){
        results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;
    }
        res.status(200).json(results);
    });
}


// Set storage location and file naming convention for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.body)
        cb(null, './uploads/');  // Store images in './uploads' directory
    },
    filename: function (req, file, cb) {
        
        cb(null, Date.now() + path.extname(file.originalname));  // Use a unique name based on the timestamp
    }
});

const upload = multer({ storage: storage });


//Insert product into inventory
const productInsert = (req, res) => {
    const fileName = req.file.filename;  
    const { 
        ProductName,
        Distributor,
        Quantity,
        Expiration,
        StorageRequirement,
        Cost,
        Weight,
        Category,
        SupplierCost,
        Description
    } = JSON.parse(req.body.Json);

    console.log({ProductName, Distributor, Quantity, Expiration, StorageRequirement, Cost, Weight, Category, SupplierCost, Description})
    //Make sure all the entries are up to code
    if(!insertFormat(Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, fileName, Description)){
        res.status(400).json({error:"bad request format"})
        return;
    }

    //Unique ID
    let InventoryID = uuidv4(); // Generates a cryptographically safe unique customer ID'
                
    //Insert into the inventory
    pool.query('INSERT IGNORE INTO inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, StorageRequirement, LastModification, ImageLink, Cost, Description) Values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [InventoryID, Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, new Date(), fileName, Number(Cost), Description], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
          res.status(200).json({"success":true});
    });
}


//update product in inventory
const productUpdate = (req, res) => {
    const fileName = req.file.filename;  
    const { 
        ProductName,
        Distributor,
        Quantity,
        Expiration,
        StorageRequirement,
        ItemID, 
        Cost,
        Weight,
        Category,
        SupplierCost,
        Description
    } = JSON.parse(req.body.Json);
    
    //Check the format
    if(!insertFormat(Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, fileName, Description)){
        res.status(400).json({error:"bad request format"})
        return;
    }

    //Update the DB
    pool.query('update inventory set Quantity = ?, Distributor = ?, Weight = ?, ProductName = ?, Category = ?, SupplierCost = ?, Expiration = ?, StorageRequirement = ?, LastModification = curdate(), ImageLink = ?, Cost = ?, Description = ? where ItemID = ?', [Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, fileName, Number(Cost), Description, ItemID], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
          res.status(200).json({"success":true});
    });
}

//delete product 
const deleteProduct = (req, res) => {
    //Get the itemid
    let {itemid} = req.params;

    //Format the ID
    if(!itemid){
        res.status(400).json({error:"No ItemID"})
        return;
    }

    //Delete from the inventory
    pool.query('delete from inventory where ItemID = ?', [itemid], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json({"success":true});
    });
}

//Low Stock Search 
const lowStockSearch = (req,res) => {
    //Get the lowstock
    pool.query('select * from lowstocklog', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json(results);
    });
}

//Featured Search
const featuredSearch = (req,res) => {
    //Get the featured
    pool.query('SELECT featureditems.ItemID, ProductName, ImageLink FROM featureditems , inventory  WHERE featureditems.ItemID = inventory.ItemID', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        for(let i = 0; i < results.length; i++){
            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;
        }
        res.status(200).json(results);
    }); 
}

//Input Validation
const insertFormat = (Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, ImageLink, Description) => {
    if(!(Distributor && ProductName && Category && Expiration && StorageRequirement  && Description && ImageLink)){
        console.log("Missing required fields")
        return false
    }

    if (isNaN(Quantity) || isNaN(Weight) || isNaN(SupplierCost) || isNaN(Cost) || Cost < 0 ||  Quantity < 0 || Weight < 0 || SupplierCost < 0){
        console.log("Invalid number format")
        return false
    }

    if(Distributor.trim() == "" || ProductName.trim() == "" || Description.trim() == ""){
        console.log("Invalid string format")
        return false
    }

    const categoryEnum = ['Fresh Produce','Dairy and Eggs','Meat and Seafood','Frozen Foods','Bakery and Bread','Pantry Staples','Beverages','Snacks and Sweets','Health and Wellness']
    const categorySet = new Set(categoryEnum)

    if (!categorySet.has(Category)){
        console.log("Invalid category")
        return false
    }

    const storageEnum = ['Frozen','Room Temperature','Warm','Hot']
    const storageSet = new Set(storageEnum)

    if (!storageSet.has(StorageRequirement)){
        console.log("Invalid storage requirement")
        return false
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(Expiration)){
        console.log("Invalid date format")
        return false
    }
    


    const expirationDate = new Date(Expiration);

    if (isNaN(expirationDate.getTime())) {
        console.log("Invalid date format")
        return false;
    }
    return true
}

//Format for product queries
const searchProductNameFormat = (productName) => {
    return (productName && productName.trim() != "")
}

//Formatting for Category Queries
const searchCategoryFormat = (categoryName) => {
    const categoryEnum = ['Fresh Produce','Dairy and Eggs','Meat and Seafood','Frozen Foods','Bakery and Bread','Pantry Staples','Beverages','Snacks and Sweets','Health and Wellness']
    const categorySet = new Set(categoryEnum)
    return categorySet.has(categoryName)
}


//Exporting the methods
module.exports = {upload, featuredSearch, productQueryID, productQueryNameEmployee, productQueryName, categoryQuery, categoryQueryEmployee, productInsert, productUpdate, deleteProduct, lowStockSearch, productCustomerQueryID}
    
