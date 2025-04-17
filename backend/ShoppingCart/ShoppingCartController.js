const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode, validateQuantity} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger'); 

//Getting Customer Shoppingcart
const getShoppingCart = (req, res) => {

    logger.info("Getting Shopping Cart...")

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    pool.query("select * from shoppingcart s, inventory i where s.customerid = ? and s.itemid = i.itemid", [customerID], (error,result)=>{

        if(error){

            logger.error("Error Fetching Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Customer Shoppingcart'});

        }

        logger.info("Successfully Fetched Shopping Cart")

        return res.status(statusCode.OK).json(result)

    })
    
}

//Add To Customer Shoppingcart
const addToShoppingCart = (req, res) => {

    logger.info("Adding To Shopping Cart...")

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const {ItemID, Quantity} = req.body

    if(!validateID(ItemID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"ItemID Is Invalid"})

    }

    if(!validateQuantity(Quantity)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Quantity Is Invalid"})

    }

    pool.query(`INSERT INTO shoppingcart (customerid, itemid, orderquantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE orderquantity = ?`, [customerID, ItemID, Quantity, Quantity], (error, result)=>{

        if(error){

            logger.error("Error Adding To Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding To Customer Shoppingcart'});

        }

        logger.info("Successfully Added To Shopping Cart")

        return res.sendStatus(statusCode.OK)

    }

    )

}

//Updating The Shoppingcart
const updateShoppingCart = (req, res) => {

    logger.info("Updating Shopping Cart...")

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const {ItemID, Quantity} = req.body

    if(!validateID(ItemID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"ItemID Is Invalid"})

    }

    if(!validateQuantity(ItemID, Quantity)){

        return res.status(statusCode.BAD_REQUEST).json({error:"Quantity Is Invalid"})

    }

    pool.query("UPDATE shoppingcart SET orderquantity = ? WHERE customerid = ? AND itemid = ?", [Quantity, customerID, ItemID], (error, result)=>{

        if(error){

            logger.error("Error Updating Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Customer Shoppingcart'});

        }

        logger.info("Successfully Updated Shopping Cart")

        return res.sendStatus(statusCode.OK)

    }

    )

}

//Remove From Customer Shoppingcart
const removeFromShoppingCart = (req, res) => {

    logger.info("Removing From Shoppingcart...")

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const {ItemID} = req.body

    if(!validateID(ItemID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"ItemID Is Invalid"})

    }

    pool.query("DELETE FROM shoppingcart WHERE customerid = ? AND itemid = ?", [customerID, ItemID], (error, result)=>{

        if(error){

            logger.error("Error Removing From Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Removing From Customer Shoppingcart'});

        }

        logger.info("Successfully Removed From Shoppingcart")

        return res.sendStatus(statusCode.OK)

    }

    )

}

//Clearing Shoppingcart Of Customer
const clearShoppingCart = (req, res) => {

    logger.info("Clearing Shoppingcart...")

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    pool.query("DELETE FROM shoppingcart WHERE customerid = ?", [customerID], (error, result)=>{

        if(error){

            logger.error("Error Clearing Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Clearing Customer Shoppingcart'});

        }

        logger.error("Successfully Cleared Shoppingcart")

        return res.sendStatus(statusCode.OK)

    }

    )

}

module.exports = {removeFromShoppingCart, clearShoppingCart, updateShoppingCart, addToShoppingCart, getShoppingCart}