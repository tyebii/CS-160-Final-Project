//Import the database connection pool
const pool = require('../Database Pool/DBConnections')


//Call back for category name queries
const categoryQuery = (req, res) => {
    let {name} = req.params;
    name = name.replace("-"," ");
    if(!searchCategoryFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }
    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE category = ?', [name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
};

//Call back for product name queries
const productQueryName = (req, res) => {
    let {name} = req.params;
    name = name.replace("-"," ");
    if(!searchProductNameFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }
    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.status(200).json(results);
    });
}

//Call back for category name queries
const categoryQueryEmployee = (req, res) => {
    let {name} = req.params;
    name = name.replace("-"," ");
    if(!searchCategoryFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }
    pool.query('SELECT * FROM inventory WHERE category = ?', [name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
};

//Call back for product name queries
const productQueryNameEmployee = (req, res) => {
    let {name} = req.params;
    name = name.replace("-"," ");
    if(!searchProductNameFormat(name)){
        res.status(400).json({error:"bad request format"})
        return;
    }
    pool.query('SELECT * FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.status(200).json(results);
    });
}

//Call back for product id queries
const productQueryID = (req, res) => {
    let {itemid} = req.params;
    if(!searchProductIDFormat(itemid)){
        res.status(400).json({error:"bad request format"})
        return;
    }
    pool.query('SELECT * FROM inventory WHERE ItemID = ?', [itemid], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
        res.status(200).json(results);
    });
}

//Insert product into inventory
const productInsert = (req, res) => {
    const {ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost,  Expiration, StorageRequirement, ImageLink, Description} = req.body;
    if(!insertFormat(ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, ImageLink, Description)){
        res.status(400).json({error:"bad request format"})
        return;
    }
    pool.query('INSERT INTO inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, StorageRequirement, LastModification, ImageLink, Cost, Description) Values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ItemID, Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, new Date(), ImageLink, Number(Cost), Description], (err, results) => {
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
    const {ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost,  Expiration, StorageRequirement, ImageLink, Description} = req.body;
    if(!insertFormat(ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, ImageLink, Description)){
        res.status(400).json({error:"bad request format"})
        return;
    }
    pool.query('update inventory set Quantity = ?, Distributor = ?, Weight = ?, ProductName = ?, Category = ?, SupplierCost = ?, Expiration = ?, StorageRequirement = ?, LastModification = curdate(), ImageLink = ?, Cost = ?, Description = ? where ItemID = ?', [Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, ImageLink, Number(Cost), Description, ItemID], (err, results) => {
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
    let {itemid} = req.params;
    if(!searchProductIDFormat(itemid)){
        res.status(400).json({error:"bad request format"})
        return;
    }
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
    pool.query('select * from lowstocklog', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
}


//Input Validation
const insertFormat = (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, ImageLink, Description) => {
    if(!(ItemID && Distributor && ProductName && Category && Expiration && StorageRequirement && ImageLink && Description)){
        return false
    }
    
    const regexItemID = /^I\d{12}$/
    if (!regexItemID.test(ItemID)){
        return false
    }

    if (isNaN(Quantity) || isNaN(Weight) || isNaN(SupplierCost) || isNaN(Cost) || Cost < 0 ||  Quantity < 0 || Weight < 0 || SupplierCost < 0){
        return false
    }

    if(Distributor.trim() == "" || ProductName.trim() == "" || ImageLink.trim() == "" || Description.trim() == ""){
        return false
    }

    const categoryEnum = ['Fresh Produce','Dairy and Eggs','Meat and Seafood','Frozen Foods','Bakery and Bread','Pantry Staples','Beverages','Snacks and Sweets','Health and Wellness']
    const categorySet = new Set(categoryEnum)

    if (!categorySet.has(Category)){
        return false
    }

    const storageEnum = ['Frozen','Room Temperature','Warm','Hot']
    const storageSet = new Set(storageEnum)

    if (!storageSet.has(StorageRequirement)){
        return false
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(Expiration)){
        return false
    }
    


    const expirationDate = new Date(Expiration);

    if (isNaN(expirationDate.getTime())) {
        return false;
    }
    return true
}

const searchProductIDFormat = (ItemID) => {
    const regexItemID = /^I\d{12}$/
    if (!regexItemID.test(ItemID)){
        return false
    }
    return true
}

const searchProductNameFormat = (productName) => {
    return (productName && productName.trim() != "")
}

const searchCategoryFormat = (categoryName) => {
    const categoryEnum = ['Fresh Produce','Dairy and Eggs','Meat and Seafood','Frozen Foods','Bakery and Bread','Pantry Staples','Beverages','Snacks and Sweets','Health and Wellness']
    const categorySet = new Set(categoryEnum)
    return categorySet.has(categoryName)
}


//Exporting the methods
module.exports = {productQueryID, productQueryNameEmployee, productQueryName, categoryQuery, categoryQueryEmployee, productInsert, productUpdate, deleteProduct, lowStockSearch}
    
