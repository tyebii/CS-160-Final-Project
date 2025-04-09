const express = require('express')
const {authenticateToken, authorizeManager, authorizeEmployee} = require('../Auth/AuthenticationController.js')
const router = express.Router();
const {upload, featuredSearch, productCustomerQueryID, productQueryID, productQueryName, productQueryNameEmployee, categoryQuery, categoryQueryEmployee,  productInsert, productUpdate, deleteProduct, lowStockSearch} = require('./inventoryControllers.js')

router.get('/search/category/customer/:name',express.json(), categoryQuery);

router.get('/search/item/customer/:name',express.json(), productQueryName);
  
router.get('/search/category/employee/:name',express.json(), authenticateToken, authorizeEmployee, categoryQueryEmployee);

router.get('/search/item/employee/:name',express.json(), authenticateToken, authorizeEmployee, productQueryNameEmployee);
  
router.get('/search/itemID/customer/:itemid',express.json(), productCustomerQueryID);

router.get('/search/itemID/employee/:itemid',express.json(), authenticateToken, authorizeEmployee, productQueryID);

router.post('/insert/item', authenticateToken, authorizeManager,upload.single('File'), productInsert);

router.put('/update/item', authenticateToken, authorizeManager, upload.single('File'), productUpdate);

router.delete('/delete/item/:itemid',express.json(), authenticateToken, authorizeManager, deleteProduct)

router.get('/lowstock',express.json(), authenticateToken, authorizeEmployee, lowStockSearch)

router.get('/featured',express.json(), featuredSearch)

module.exports = router