//Ready For Testing

const pool = require('../Database Pool/DBConnections')

const {validateCategory, validateProduct, validateID, statusCode, insertFormat} = require('../Utils/Formatting')

const {itemIDExists} = require('../Utils/ExistanceChecks.js')

const {generateUniqueID} = require('../Utils/Generation.js')

const path = require('path');

const multer = require('multer');

const fs = require('fs/promises');

const {logger} = require('../Utils/Logger'); 

//Make A Search For Items In A Category As A Customer
const categoryQuery = (req, res) => {

    logger.info("Starting Customer Category Query")

    let {name} = req.params;

    try{

        name = name.replace(/-/g, " "); 

    }catch(error){

        logger.error("Error While Making A Category Search With Message: " + error.message)

        return res.status(statusCode.BAD_REQUEST).json({error: "Category Name Is Invalid"})

    }


    if(!validateCategory(name)){

        logger.error("Format For The Category Search Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Category Name Is Invalid"})
        
    }

    logger.info(`Fetching The Items Associated With The Category: ${name}`)

    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE category = ?', [name], (error, results) => {

        if (error) {

            logger.error("Error While Trying To Query Category As A Customer: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Category'});

        }
    
        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Category"})

        }


        logger.info("Fetched The Items And Their Associated Images")

        return res.status(statusCode.OK).json(results);

    });

};

//Make A Search For Items By Their Name As A Customer
const productQueryName = (req, res) => {
    
    logger.info("Starting Customer Name Query")

    let {name} = req.params;

    if(!validateProduct(name)){

        logger.error("Product Search Parameter Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Product Search Is Invalid"})

    }

    try{

        name = name.replace(/-/g, " "); 

    }catch(error){

        logger.error("Error While Making A Product Search With Message: " + error.message)

        return res.status(statusCode.BAD_REQUEST).json({error: "Product Search Name Is Invalid"})

    } 

    logger.info(`Fetching The Items Associated With The Product: ${name}`)

    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (error, results) => {

        if (error) {

            logger.error("Error While Trying To Query Product: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product'});

        }

        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Product"})

        }

        logger.info("Fetched The Items And Their Associated Images")

        return res.status(statusCode.OK).json(results);

    });
}

//Make A Search For Items In A Category As An Employee
const categoryQueryEmployee = (req, res) => {

    logger.info("Starting Employee Category Query")

    let {name} = req.params;

    try{

        name = name.replace(/-/g, " "); 

    }catch(error){

        logger.error("Error While Making A Category Employee Search With Message: " + error.message)

        return res.status(statusCode.BAD_REQUEST).json({error: "Category Name Is Invalid"})

    }

    if(!validateCategory(name)){

        logger.error("Format For The Category Employee Search Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Category Name Is Invalid"})
        
    }

    logger.info(`Fetching The Items Associated With The Category: ${name}`)

    pool.query('SELECT * FROM inventory WHERE category = ?', [name], (error, results) => {

        if (error) {

            logger.error("Error While Trying To Query Category As An Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Category'});

        }
        
        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Category As Employee"})

        }

        logger.info("Fetched The Items And Their Associated Images")

        return res.status(statusCode.OK).json(results);

    });
};

//Make A Search For Items By Their Name As An Employee
const productQueryNameEmployee = (req, res) => {

    logger.info("Starting Employee Name Query")

    let {name} = req.params;

    if(!validateProduct(name)){

        logger.error("Product Search Parameter Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Product Search Is Invalid"})

    }

    try{

        name = name.replace(/-/g, " "); 

    }catch(error){

        logger.error("Error While Making A Product Search With Message: " + error.message)

        return res.status(statusCode.BAD_REQUEST).json({error: "Product Search Name Is Invalid"})

    } 

    logger.info(`Fetching The Items Associated With The Product: ${name}`)

    pool.query('SELECT * FROM inventory WHERE ProductName like ?', ["%" + name + "%"], (error, results) => {

        if (error) {

            logger.error("Error While Trying To Query Product As Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product As An Employee'});

        }

        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Product"})

        }

        logger.info("Fetched The Items And Their Associated Images")

        return res.status(statusCode.OK).json(results);

    });

}

//Make A Search For Items By Their ID As An Employee
const productQueryID = (req, res) => {

    logger.info("Starting Employee ID Query")

    let {itemid} = req.params;

    if(!validateID(itemid)){

        logger.error("Invalid Format When Trying To Make An ItemID Query As An Employee")

        return res.status(statusCode.BAD_REQUEST).json({error:"Item ID Search Is Invalid"})

    }

    logger.info("Querying Item With ItemID As An Employee: " + itemid)

    pool.query('SELECT inventory.ItemID, inventory.Quantity, inventory.Distributor, inventory.Weight, inventory.ProductName, inventory.Category, inventory.SupplierCost, inventory.Expiration, inventory.Cost, inventory.StorageRequirement, inventory.LastModification, inventory.ImageLink, inventory.Description, featureditems.ItemID as FeaturedID FROM inventory LEFT JOIN featureditems ON inventory.ItemID = featureditems.ItemID WHERE inventory.ItemID = ?', [itemid], (error, results) => {
        
        if (error) {

           logger.error("Error While Trying To Query Product By ID As An Employee: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product By ID'});

        }

        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Product By ID"})

        }

        logger.info("Fetched The Items And Their Associated Images As An Employee")

        return res.status(statusCode.OK).json(results);

    });

}

//Make A Search For Items By Their ID As A Customer
const productCustomerQueryID = (req, res) => {

    logger.info("Starting Customer ID Query")

    let {itemid} = req.params;

    if(!validateID(itemid)){

        logger.error("Invalid Format When Trying To Make An ItemID Query As A Customer")

        return res.status(statusCode.BAD_REQUEST).json({error:"Item ID Search Is Invalid"})

    }

    logger.info("Querying Item With ItemID As A Customer: " + itemid)

    pool.query('SELECT ItemID, Quantity, Distributor, Weight, ProductName, Category, Expiration, Cost, StorageRequirement, ImageLink, Description FROM inventory WHERE ItemID = ?', [itemid], (error, results) => {

        if (error) {

            logger.error("Error While Trying To Query Product As A Customer: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error While Searching Product By ID'});

        }

        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Product"})

        }

        logger.info("Fetched The Items And Their Associated Images As A Customer")

        return res.status(statusCode.OK).json(results);

    });
}

//Middleware For File Uploads
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        logger.info(`Uploading file to: ./uploads/`);

        cb(null, './uploads/');

    },

    filename: function (req, file, cb) {

        const fileName = Date.now() + path.extname(file.originalname);

        logger.info(`Saving file as: ${fileName}`);

        cb(null, fileName);

    }

});


const upload = multer({ storage: storage });

//Insert Products Into Inventory
const productInsert = async (req, res) => {

    logger.info("Starting Product Insert")

    let fileName;

    try{

        fileName = req.file?.filename;  

        if(!fileName){

            logger.error("File Does Not Exist")

            throw new Error("No File Detected")

        }

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
    
            logger.error("Format Is Not Valid For The Product Insert Request")

            throw new Error("Invalid Format On Item Update")
    
        }
    
        let InventoryID;
    
        try{
    
            InventoryID = await generateUniqueID(itemIDExists)
    
        }catch(error){

            logger.error("Error Generating UUID For New Inventory Item")
    
            throw new Error("Internal Server Error While Generating Unique ID")
        
        }
    
                    
        pool.query('INSERT IGNORE INTO inventory (ItemID, Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Expiration, StorageRequirement, LastModification, ImageLink, Cost, Description) Values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [InventoryID, Number(Quantity), Distributor, Number(Weight), ProductName, Category, Number(SupplierCost), new Date(Expiration), StorageRequirement, new Date(), fileName, Number(Cost), Description], (error, results) => {
    
            if (error) {
    
                logger.error('Error Executing Item Insert: ', error.message);
    
                throw new Error("Internal Server Inserting Into Inventory")
    
            }
    
             return res.status(statusCode.OK).json({success:true});
    
        });

    }catch(error){

        logger.error("Error While Inserting New Inventory Item: " + error.message)

        if(fileName){
            
            try {

                logger.info("Deleting Image From Backend Files");
            
                const imagePath = path.join(__dirname, '../uploads', fileName);

                await fs.unlink(imagePath);
            
                logger.info(`Successfully Deleted Image: ${fileName}`);

            } catch (error) {

                logger.error(`Error Deleting Image (${fileName}): ${error.message}`);

            }

        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Inserting Item"});

    }
}

//Update Product In Inventory
const productUpdate = async (req, res) => {

    logger.info("Begining Product Update")

    let connection;

    let fileName = req.file?.filename;

    let imageDir;

    let backupPath;

    try {

        imageDir = path.join(__dirname, '../uploads');

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

        if (!insertFormat(Quantity, Distributor, Weight, ProductName, Category, SupplierCost, Cost, Expiration, StorageRequirement, Description)) {
            
            logger.error("Invalid Format On Item Update")

            throw new Error("Invalid Format On Item Update");

        }

        if (fileName) {

            logger.info("Inserting Item With New Image")

            connection = await pool.promise().getConnection();

            await connection.beginTransaction();

                const [fetchImageLink] = await connection.query(

                    'SELECT ImageLink FROM Inventory WHERE ItemID = ?', 

                    [ItemID]

                );

                const oldImageName = fetchImageLink[0]?.ImageLink;

                const oldImagePath = path.join(imageDir, oldImageName);

                backupPath = path.join(imageDir, 'backup_' + oldImageName);

                await fs.copyFile(oldImagePath, backupPath);

                await fs.unlink(oldImagePath);

                await connection.query(

                    `UPDATE inventory SET 

                        Quantity = ?, 

                        Distributor = ?, 

                        Weight = ?, 

                        ProductName = ?, 

                        Category = ?, 

                        SupplierCost = ?, 

                        Expiration = ?, 

                        StorageRequirement = ?, 

                        LastModification = CURDATE(), 

                        ImageLink = ?, 

                        Cost = ?, 

                        Description = ? 

                    WHERE ItemID = ?`,

                    [
                        Number(Quantity), Distributor, Number(Weight),

                        ProductName, Category, Number(SupplierCost),

                        new Date(Expiration), StorageRequirement,

                        fileName, Number(Cost), Description, ItemID

                    ]

                );
                
                await fs.unlink(backupPath);

            await connection.commit();

            connection.release();

            logger.info("Successful Update Of Information And Images")

            return res.status(statusCode.OK).json({ success: true });

        } else {

            pool.query(

                `UPDATE inventory SET 

                    Quantity = ?, Distributor = ?, Weight = ?, ProductName = ?, 

                    Category = ?, SupplierCost = ?, Expiration = ?, 

                    StorageRequirement = ?, LastModification = CURDATE(), 

                    Cost = ?, Description = ? 

                 WHERE ItemID = ?`,

                [

                    Number(Quantity), Distributor, Number(Weight), ProductName, 

                    Category, Number(SupplierCost), new Date(Expiration), 

                    StorageRequirement, Number(Cost), Description, ItemID

                ],

                (error, results) => {

                    if (error) {

                        logger.error('Error Executing Item Update:', error.message);

                        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Item' });

                    }

                    return res.status(statusCode.OK).json({ success: true });

                }

            );

        }

    } catch (error) {

        logger.error("Error Updating Item: " + error.message)

        if (connection) {

            try {

                logger.info("Rolling Back Connection");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Error during rollback: " + rollbackError.message);

            }
        
            try {

                logger.info("Releasing Connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Error releasing connection: " + releaseError.message);

            }
            
        }

        if (fileName) {

            logger.info("Removing New Image")

            try {

                const newImagePath = path.join(imageDir, fileName);

                await fs.unlink(newImagePath);

            } catch (deleteErr) {

                logger.error('Failed to remove new image:', deleteErr.message);

            }

        }

        if (backupPath) {

            logger.info("Restoring Old Image")

            try {

                const oldImagePath = path.join(imageDir, path.basename(backupPath).replace('backup_', ''));

                await fs.copyFile(backupPath, oldImagePath);

                await fs.unlink(backupPath); 

            } catch (restoreErr) {

                logger.error('Failed to restore image:', restoreErr.message);

            }

        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Updating Item" });
    }

};

//Delete product 
const deleteProduct = async (req, res) => {

    logger.info("Starting The Deletion Of A Product")

    let { itemid } = req.params;

    if (!validateID(itemid)) {

        logger.error("Item ID Is Invalid In Product Deletion")

        return res.status(statusCode.BAD_REQUEST).json({ error: "Item ID Is Invalid" });

    }

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

            logger.info("Searching For Item's Image")

            const [rows] = await connection.query('SELECT ImageLink FROM inventory WHERE ItemID = ?', [itemid]);

            if (rows.length === 0) {

                connection.release();

                logger.error("Item Not Found For Deletion")

                return res.status(statusCode.NOT_FOUND).json({ error: "Item Not Found" });

            }

            const imageFileName = rows[0].ImageLink;

            logger.info("Deleting The Image")

            const imagePath = path.join(__dirname, '../uploads', imageFileName);

            await fs.unlink(imagePath);

            logger.info("Deleting The Item")

            await connection.query('DELETE FROM inventory WHERE ItemID = ?', [itemid]);

        await connection.commit();

        connection.release();

        logger.info("Deleted Image And Item")

        return res.status(statusCode.OK).json({ success: true });

    } catch (error) {

        logger.error("Error While Deleting Item: " + error.message)

        if (connection) {

            try {

                logger.info("Rolling Back Connection");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Error during rollback: " + rollbackError.message);

            }
        
            try {

                logger.info("Releasing Connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Error releasing connection: " + releaseError.message);

            }

        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Deleting Product' });

    }
};

//Low Stock Search 
const lowStockSearch = (req,res) => {

    logger.info("Starting Low Stock Search")

    pool.query('select * from lowstocklog, inventory where lowstocklog.itemid = inventory.itemid', (error, results) => {

        if (error) {

            logger.error('Error Executing Low Stock Search:', error.message);

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Low Stock' });

        }

        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Lowstock Items"})

        }

        logger.info("Fetched The Items And Their Associated Images In Lowstock Search")

        return res.status(statusCode.OK).json(results);

    });

}

//Search For Featured Items
const featuredSearch = (req,res) => {
    
    logger.info("Starting Featured Search")

    pool.query('SELECT * FROM featureditems , inventory  WHERE featureditems.ItemID = inventory.ItemID', (error, results) => {

        if (error) {

            logger.error('Error Executing Fetch Of Featured Items:', error.message);

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Featured Items' });

        }

        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Featured Items"})

        }

        logger.info("Fetched The Items And Their Associated Images In Featured Search")

        return res.status(statusCode.OK).json(results);

    }); 
}

//Search For Expired Items
const expirationSearch = (req,res) => {

    logger.info("Starting A Search For Expired Items")

    pool.query('Select * From NearExpiration, Inventory Where NearExpiration.ItemID = Inventory.ItemID', (error,results)=>{

        if (error) {

            logger.error('Error Executing Fetch Of Expired Items:', error.message);

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Expired Items' });

        }

        logger.info("Fetched The Items... Creating Static Image Links")

        try{

            for(let i = 0; i < results.length; i++){

                results[i].ImageLink = `${process.env.IMAGE_URL}` + results[i].ImageLink;

            }

        }catch(error){

            logger.error("Error While Creating Static Links For Images: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error While Searching Expired Items"})

        }

        logger.info("Fetched The Items And Their Associated Images In Expiration Search")

        return res.status(statusCode.OK).json(results);

    })

}

//Adding To Featured Items
const featuredAdd = (req,res)=>{

    logger.info("Starting A Featured Add")

    const {ItemID} = req.body

    if(!validateID(ItemID)){

        logger.error("Invalid Item ID In Featured Add")

        return res.status(statusCode.BAD_REQUEST).json({ error: "Item ID Is Invalid" });

    }

    pool.query('Insert Into FeaturedItems(ItemID) Values (?)', ItemID, (error,results)=>{

        if (error) {

            logger.error('Error Executing Add Of Featured Item:', error.message);

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding Featured Item' });

        }

        logger.info("Adding Featured Item Successful")

        return res.status(statusCode.OK).json(results);

    })

}

//Deleting From Featured Items
const featuredDelete = (req,res) => {
    
    logger.info("Starting A Featured Delete")

    let { itemid } = req.params;

    if(!validateID(itemid)){

        logger.error("Invalid Item ID When Performing A Featured Delete")

        return res.status(statusCode.BAD_REQUEST).json({ error: "Item ID Is Invalid" });

    }

    pool.query('Delete From FeaturedItems Where ItemID = ?', itemid, (error,results)=>{

        if (error) {

            logger.error('Error Executing Deletion Of Featured Item:', error.message);

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Deleting Featured Item' });

        }

        logger.info("Deletion Of Featured Item Successful")

        return res.status(statusCode.OK).json(results);

    })

}

module.exports = {upload, featuredAdd,  expirationSearch, featuredDelete, featuredSearch, productQueryID, productQueryNameEmployee, productQueryName, categoryQuery, categoryQueryEmployee, productInsert, productUpdate, deleteProduct, lowStockSearch, productCustomerQueryID}
    
