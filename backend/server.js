const express = require('express');
const cors = require('cors');  //NPM Install Cors
const app = express();
const PORT = 3301;
const shoppingcart = require('./ShoppingCart/ShoppingCart.js')
const inventory = require('./Inventory/inventory.js')
const authentication = require('./Auth/Authentication.js')
const address = require('./Checkout/Address.js')
app.use(express.json())
app.use('/api',inventory)
app.use('/api', authentication)
app.use('/api', shoppingcart)
app.use('/api', address)

// Enable CORS for requests from localhost:3300 only
app.use(cors({
  origin: 'http://localhost:3300',  
  methods: 'GET,POST,DELETE,PUT',  
  allowedHeaders: 'Content-Type', 
}));





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

