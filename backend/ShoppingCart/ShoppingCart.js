const express = require('express')
const {removeFromShoppingCart, updateShoppingCart, addToShoppingCart, getShoppingCart, clearShoppingCart} = require('./ShoppingCartController')
const { authenticateToken, authorizeCustomer } = require('../Auth/AuthenticationController')
const router = express.Router()
router.use([authenticateToken,authorizeCustomer])

router.get('/shoppingcart', getShoppingCart)

router.post('/shoppingcart',  addToShoppingCart)

router.put('/shoppingcart',  updateShoppingCart)

router.delete('/shoppingcart',  removeFromShoppingCart)

router.delete('/shoppingcart/clear',  clearShoppingCart)

module.exports = router