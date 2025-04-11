const express = require('express')

const {removeFromShoppingCart, updateShoppingCart, addToShoppingCart, getShoppingCart, clearShoppingCart} = require('./ShoppingCartController')

const {authorizeCustomer} = require('../Utils/Authorization')

const {authenticateToken} = require('../Utils/Authentication')

const router = express.Router()

router.use([express.json(), authenticateToken, authorizeCustomer])

router.get('/shoppingcart', getShoppingCart)

router.post('/shoppingcart',  addToShoppingCart)

router.put('/shoppingcart',  updateShoppingCart)

router.delete('/shoppingcart',  removeFromShoppingCart)

router.delete('/shoppingcart/clear',  clearShoppingCart)

module.exports = router