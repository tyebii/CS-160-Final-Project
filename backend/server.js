const express = require('express');
require('dotenv').config();
const cors = require('cors');  // NPM Install Cors
const app = express();
const PORT = 3301;

const shoppingcart = require('./ShoppingCart/ShoppingCart.js');
const inventory = require('./Inventory/inventory.js');
const authentication = require('./Auth/Authentication.js');
const address = require('./Checkout/Address.js');
const robot = require('./Robot/Robot.js');
const employee = require('./Employee/Employee.js');
const customer = require('./Customer/Customer.js');
const transaction = require('./Transactions/Transaction.js');
const stripe = require('./Stripe/Stripe.js')

// Apply CORS before route handling
app.use(cors({
  origin: '*',
  methods: 'GET,POST,DELETE,PUT,OPTIONS',  // Make sure OPTIONS is allowed
  allowedHeaders: 'Content-Type, Authorization', // Allow Content-Type and Authorization headers
}));

// Middleware for parsing JSON
//app.use(express.json());

// Routes
app.use('/api', stripe)
app.use('/api', inventory);
app.use('/api', authentication);
app.use('/api', shoppingcart);
app.use('/api', address);
app.use('/api', robot);
app.use('/api', employee);
app.use('/api', customer);
app.use('/api', transaction);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
