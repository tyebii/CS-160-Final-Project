const pool = require('../Database Pool/DBConnections')

const {validateCategory, validateProduct, validateID, statusCode, insertFormat} = require('../Utils/Formatting')

const {itemIDExists} = require('../Utils/Generation.js')

const generateUniqueID = require('../Utils/Generation.js')

const path = require('path');

const multer = require('multer');

const categoryQuery = (req, res) => {

    let {name} = req.params;

    if(!validateCategory(name)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Category Name Is Invalid"})
        
    }

    name = name.replace(/-/g, " "); 

    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE category = ?', [name], (error, results) => {

        if (error) {

            console.log("Error While Trying To Query Category As A Customer: " + error.message)

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Category'});

            return;
        }
        
        for(let i = 0; i < results.length; i++){

            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

        }

        return res.status(statusCode.OK).json(results);

    });
};

const productQueryName = (req, res) => {
    
    let {name} = req.params;

    if(!validateProduct(name)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Product Search Is Invalid"})

    }

    name = name.replace(/-/g, " "); 

    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (error, results) => {

        if (error) {

            console.log("Error While Trying To Query Product: " + error.message)

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product'});

            return;
        }

        for(let i = 0; i < results.length; i++){

            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

        }

        res.status(statusCode.OK).json(results);

    });
}

const categoryQueryEmployee = (req, res) => {

    let {name} = req.params;

    if(!validateCategory(name)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Category Name Is Invalid"})

    }

    name = name.replace(/-/g, " "); 

    pool.query('SELECT * FROM inventory WHERE category = ?', [name], (error, results) => {

        if (error) {

            console.log("Error While Trying To Query Category As An Employee: " + error.message)

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Category'});

            return;

        }
        
        for(let i = 0; i < results.length; i++){

            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

        }

        return res.status(statusCode.OK).json(results);

    });
};

const productQueryNameEmployee = (req, res) => {

    let {name} = req.params;

    if(!validateProduct(name)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Product Search Is Invalid"})

    }

    name = name.replace(/-/g, " "); 

    pool.query('SELECT * FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (error, results) => {

        if (error) {

            console.log("Error While Trying To Query Product: " + error.message)

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product'});

          return;

        }

        for(let i = 0; i < results.length; i++){

            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

        }

        res.status(statusCode.OK).json(results);

    });
}

const productQueryID = (req, res) => {

    let {itemid} = req.params;

    if(validateID(itemid)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Item ID Search Is Invalid"})

    }

    pool.query('SELECT * FROM inventory WHERE ItemID = ?', [itemid], (error, results) => {

        if (error) {

            console.log("Error While Trying To Query Product: " + error.message)

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product'});

          return;

        }

        for(let i = 0; i < results.length; i++){

            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

        }

        res.status(statusCode.OK).json(results);

    });
}

const productCustomerQueryID = (req, res) => {

    let {itemid} = req.params;

    if(validateID(itemid)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Item ID Search Is Invalid"})

    }

    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ItemID = ?', [itemid], (error, results) => {

        if (error) {

            console.log("Error While Trying To Query Product: " + error.message)

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product'});

            return;

        }

        for(let i = 0; i < results.length; i++){

            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

        }

        res.status(statusCode.OK).json(results);

    });
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, './uploads/'); 

    },

    filename: function (req, file, cb) {
        
        cb(null, Date.now() + path.extname(file.originalname));  

    }
});

const upload = multer({ storage: storage });

const productInsert = async (req, res) => {

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
    
    if(!insertFormat(Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Invalid Format On Item Update"})

    }

    let InventoryID;

    try{
        InventoryID = await generateUniqueID(itemIDExists)
    }catch(error){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Item' });
    }

                
    pool.query('INSERT IGNORE INTO inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, StorageRequirement, LastModification, ImageLink, Cost, Description) Values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [InventoryID, Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, new Date(), fileName, Number(Cost), Description], (error, results) => {

        if (error) {

            console.error('Error Executing Item Update:', error);

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Item' });

            return;

        }

         return res.status(statusCode.OK).json({success:true});

    });
}

//update product in inventory
const productUpdate = (req, res) => {
    let fileName;

    if(req.file){

        fileName = req.file.filename;  

    }

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
    

    if(!insertFormat(Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description)){

        res.status(statusCode.BAD_REQUEST).json({error:"Invalid Format On Item Update"})

        return;

    }

    if(fileName){

        pool.query('update inventory set Quantity = ?, Distributor = ?, Weight = ?, ProductName = ?, Category = ?, SupplierCost = ?, Expiration = ?, StorageRequirement = ?, LastModification = curdate(), ImageLink = ?, Cost = ?, Description = ? where ItemID = ?', [Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, fileName, Number(Cost), Description, ItemID], (error, results) => {

            if (error) {

                console.error('Error Executing Item Update:', error);

                res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Item' });

                return;

            }

              res.status(statusCode.OK).json({"success":true});

        });

    }else{

        pool.query('update inventory set Quantity = ?, Distributor = ?, Weight = ?, ProductName = ?, Category = ?, SupplierCost = ?, Expiration = ?, StorageRequirement = ?, LastModification = curdate(), Cost = ?, Description = ? where ItemID = ?', [Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, Number(Cost), Description, ItemID], (error, results) => {
           
            if (error) {

                console.error('Error Executing Item Update:', error);

                res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Item' });

                return;

            }

              res.status(statusCode.OK).json({"success":true});

        });
    }

}

//delete product 
const deleteProduct = async (req, res) => {

    let { itemid } = req.params;

    if (validateID(itemid)) {

        return res.status(statusCode.BAD_REQUEST).json({ error: "Item ID Search Is Invalid" });

    }

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

        // Get image link
        const [rows] = await connection.query('SELECT ImageLink FROM inventory WHERE ItemID = ?', [itemid]);

        if (rows.length === 0) {

            await connection.rollback();

            connection.release();

            return res.status(statusCode.NOT_FOUND).json({ error: "Item not found" });

        }

        const imageFileName = rows[0].ImageLink;

        await connection.query('DELETE FROM inventory WHERE ItemID = ?', [itemid]);

        await connection.commit();

        const imagePath = path.join(__dirname, '../uploads', imageFileName);

        await fs.unlink(imagePath);

        connection.release();

        return res.status(statusCode.OK).json({ success: true });

    } catch (error) {

        if (connection) {

            await connection.rollback();

            connection.release();

        }

        console.error('Error While Deleting Product:', error);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Deleting Product' });

    }
};

//Low Stock Search 
const lowStockSearch = (req,res) => {

    pool.query('select * from lowstocklog', (error, results) => {

        if (error) {

            console.error('Error Executing Low Stock Search:', error.message);

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Low Stock' });

            return;

        }

        res.status(statusCode.OK).json(results);

    });
}

//Featured Search
const featuredSearch = (req,res) => {

    pool.query('SELECT featureditems.ItemID, ProductName, ImageLink FROM featureditems , inventory  WHERE featureditems.ItemID = inventory.ItemID', (error, results) => {

        if (error) {

            console.error('Error Executing Fetch Of Featured Items:', error.message);

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Featured Items' });

            return;

        }

        for(let i = 0; i < results.length; i++){

            results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

        }

        res.status(statusCode.OK).json(results);

    }); 
}

//Exporting the methods
module.exports = {upload, featuredSearch, productQueryID, productQueryNameEmployee, productQueryName, categoryQuery, categoryQueryEmployee, productInsert, productUpdate, deleteProduct, lowStockSearch, productCustomerQueryID}
    
