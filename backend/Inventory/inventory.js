const express = require('express')

const router = express.Router();

const {authenticateToken} = require('../Utils/Authentication.js')

const {authorizeEmployee, authorizeManager} = require('../Utils/Authorization.js')

const {upload, featuredSearch, featuredAdd, featuredDelete, productCustomerQueryID, productQueryID, productQueryName, productQueryNameEmployee, categoryQuery, categoryQueryEmployee,  productInsert, productUpdate, deleteProduct, lowStockSearch, expirationSearch} = require('./inventoryControllers.js')


//Get Search Category Item Information As A Customer
router.get('/search/category/customer/:name',express.json(), categoryQuery);

//Get Search Product Information As A Customer
router.get('/search/item/customer/:name',express.json(), productQueryName);

//Get Search Category Item Information As An Employee
router.get('/search/category/employee/:name',express.json(), authenticateToken, authorizeEmployee, categoryQueryEmployee);

//Get Search Product Information As An Employee
router.get('/search/item/employee/:name',express.json(), authenticateToken, authorizeEmployee, productQueryNameEmployee);

//Get The Item Information As A Customer
router.get('/search/itemID/customer/:itemid',express.json(), productCustomerQueryID);

//Get The Item Information As An Employee
router.get('/search/itemID/employee/:itemid',express.json(), authenticateToken, authorizeEmployee, productQueryID);

//Insert An Item
router.post('/insert/item', authenticateToken, authorizeManager,upload.single('File'), productInsert);

//Update An Item
router.put('/update/item', authenticateToken, authorizeManager, upload.single('File'), productUpdate);

//Delete An Item
router.delete('/delete/item/:itemid',express.json(), authenticateToken, authorizeManager, deleteProduct)

//Get Lowstock Items
router.get('/lowstock',express.json(), authenticateToken, authorizeEmployee, lowStockSearch)

//Get Featured Items
router.get('/featured',express.json(), authenticateToken, authorizeEmployee, featuredSearch)

//Add Featured Items
router.post('/featured',express.json(), authenticateToken, authorizeManager, featuredAdd)

//Delete Featured Item
router.delete('/featured', express.json(), authenticateToken, authorizeManager, featuredDelete)

//Get Expiring Items
router.get('/expiration', expirationSearch)

module.exports = router