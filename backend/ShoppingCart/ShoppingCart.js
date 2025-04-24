const express = require('express')

const {removeFromShoppingCart, updateShoppingCart, addToShoppingCart, getShoppingCart, clearShoppingCart} = require('./ShoppingCartController')

const {authorizeCustomer} = require('../Utils/Authorization')

const {authenticateToken} = require('../Utils/Authentication')

const rateLimit = require('express-rate-limit');

const router = express.Router()

//Rate Limiter
const shoppingcartLimiter = rateLimit({

    windowMs: 60 * 1000 * 5, 

    max: 50, 

    message: { error: "Too many requests. Please try again later." },

    standardHeaders: true, 

    legacyHeaders: false,

});

router.use(shoppingcartLimiter)

router.use([express.json(), authenticateToken, authorizeCustomer])

//Get Customer Shopping Cart
router.get('/shoppingcart', getShoppingCart)

//Add To Customer Shopping Cart
router.post('/shoppingcart',  addToShoppingCart)

//Update Customer Shopping Cart
router.put('/shoppingcart',  updateShoppingCart)

//Delete Items From Shopping Cart
router.delete('/shoppingcart',  removeFromShoppingCart)

//Clear Shopping Cart
router.delete('/shoppingcart/clear',  clearShoppingCart)

module.exports = router