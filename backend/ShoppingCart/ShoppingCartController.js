//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const getShoppingCart = (req, res) => {
    const id = req.user.CustomerID
    pool.query("select * from shoppingcart s, inventory i where s.customerid = ? and s.itemid = i.itemid", [id], (err,result)=>{
        if(err){
            res.status(500)
            return;
        }
        res.status(200).json(result)
        return;
    })
}

const addToShoppingCart = (req, res) => {
    const CustomerID = req.user.CustomerID
    const {ItemID, Quantity} = req.body
    pool.query("INSERT INTO shoppingcart(customerid, itemid, orderquantity) VALUES (?,?,?)", [CustomerID, ItemID, Quantity], (err, result)=>{
        if(err){
            res.status(500);
            return;
        }
        res.status(200).json({success:"true"})
        return;
    }
    )
}


const updateShoppingCart = (req, res) => {
    const CustomerID = req.user.CustomerID
    const {ItemID, Quantity} = req.body
    pool.query("UPDATE shoppingcart SET orderquantity = ? WHERE customerid = ? AND itemid = ?", [Quantity, CustomerID, ItemID], (err, result)=>{
        if(err){
            res.status(500);
            return;
        }
        res.status(200).json({success:"true"})
        return;
    }
    )
}

const removeFromShoppingCart = (req, res) => {
    const CustomerID = req.user.CustomerID 
    const {ItemID} = req.body
    pool.query("DELETE FROM shoppingcart WHERE customerid = ? AND itemid = ?", [CustomerID, ItemID], (err, result)=>{
        if(err){
            res.status(500);
            return;
        }
        res.status(200).json({success:"true"})
        return;
    }
    )
}

module.exports = {removeFromShoppingCart, updateShoppingCart, addToShoppingCart, getShoppingCart}