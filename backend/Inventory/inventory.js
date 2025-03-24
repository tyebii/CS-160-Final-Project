const express = require('express')
const {authenticateToken, authorizeCustomer, authorizeRegularEmployee, authorizeManager, authorizeEmployee} = require('../Auth/AuthenticationController.js')
const router = express.Router();
const {productQueryID, productQueryName, productQueryNameEmployee, categoryQuery, categoryQueryEmployee,  productInsert, productUpdate, deleteProduct, lowStockSearch} = require('./inventoryControllers.js')

router.get('/search/category/customer/:name', categoryQuery);

router.get('/search/item/customer/:name', productQueryName);
  
router.get('/search/category/employee/:name', authenticateToken, authorizeEmployee, categoryQueryEmployee);

router.get('/search/item/Employee/:name', authenticateToken, authorizeEmployee, productQueryNameEmployee);
  
router.get('/search/itemID/:itemid', authenticateToken, authorizeEmployee, productQueryID);

router.post('/insert/item', authenticateToken, authorizeManager, productInsert);

router.put('/update/item', authenticateToken, authorizeManager, productUpdate);

router.delete('/delete/item/:itemid', authenticateToken, authorizeManager, deleteProduct)

router.get('/lowstock', authenticateToken, authorizeEmployee, lowStockSearch)

module.exports = router