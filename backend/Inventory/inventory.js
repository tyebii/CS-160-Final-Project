const express = require('express')
const {authenticateToken, authorizeManager, authorizeEmployee} = require('../Auth/AuthenticationController.js')
const router = express.Router();
const {featuredSearch, productCustomerQueryID, productQueryID, productQueryName, productQueryNameEmployee, categoryQuery, categoryQueryEmployee,  productInsert, productUpdate, deleteProduct, lowStockSearch} = require('./inventoryControllers.js')
router.use(express.json());

router.get('/search/category/customer/:name', categoryQuery);

router.get('/search/item/customer/:name', productQueryName);
  
router.get('/search/category/employee/:name', authenticateToken, authorizeEmployee, categoryQueryEmployee);

router.get('/search/item/employee/:name', authenticateToken, authorizeEmployee, productQueryNameEmployee);
  
router.get('/search/itemID/customer/:itemid', productCustomerQueryID);

router.get('/search/itemID/employee/:itemid', authenticateToken, authorizeEmployee, productQueryID);

router.post('/insert/item', authenticateToken, authorizeManager, productInsert);

router.put('/update/item', authenticateToken, authorizeManager, productUpdate);

router.delete('/delete/item/:itemid', authenticateToken, authorizeManager, deleteProduct)

router.get('/lowstock', authenticateToken, authorizeEmployee, lowStockSearch)

router.get('/featured', featuredSearch)

module.exports = router