const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode, validateQuantity} = require('../Utils/Formatting')

const getShoppingCart = (req, res) => {

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    pool.query("select * from shoppingcart s, inventory i where s.customerid = ? and s.itemid = i.itemid", [customerID], (error,result)=>{

        if(error){

            console.log("Error Fetching Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Customer Shoppingcart'});

        }

        res.status(statusCode.OK).json(result)

        return;
    })
}

const addToShoppingCart = (req, res) => {

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

            console.log("Error Adding To Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Adding To Customer Shoppingcart'});

        }

        res.sendStatus(statusCode.OK)

        return;
    }
    )
}

const updateShoppingCart = (req, res) => {

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

            console.log("Error Updating Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Updating Customer Shoppingcart'});

        }

        res.sendStatus(statusCode.OK)

        return;
    }
    )
}

const removeFromShoppingCart = (req, res) => {

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

            console.log("Error Removing From Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Removing From Customer Shoppingcart'});

        }

        res.sendStatus(statusCode.OK)

        return;
    }
    )
}

const clearShoppingCart = (req, res) => {

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    pool.query("DELETE FROM shoppingcart WHERE customerid = ?", [customerID], (error, result)=>{

        if(error){

            console.log("Error Clearing Customer Shopping Cart: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Clearing Customer Shoppingcart'});

        }

        res.sendStatus(statusCode.OK)

        return;
    }
    )
}

module.exports = {removeFromShoppingCart, clearShoppingCart, updateShoppingCart, addToShoppingCart, getShoppingCart}