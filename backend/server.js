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
app.use('/api/stripe', stripe)
app.use('/api/robot', robot);
app.use('/api/inventory', inventory);
app.use('/api/authentication', authentication);
app.use('/api/shoppingcart', shoppingcart);
app.use('/api/address', address);
app.use('/api/employee', employee);
app.use('/api/customer', customer);
app.use('/api/transaction', transaction);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
