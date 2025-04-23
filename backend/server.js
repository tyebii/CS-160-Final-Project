const express = require('express');

const {logger, logWithRequestId } = require('./Utils/Logger.js'); 

require('dotenv').config();

const cors = require('cors');

const app = express();

const PORT = 3301;

const shoppingcart = require('./ShoppingCart/ShoppingCart.js');

const inventory = require('./Inventory/inventory.js');

const authentication = require('./Auth/Authentication.js');

const address = require('./Address/Address.js');

const robot = require('./Robot/Robot.js');

const employee = require('./Employee/Employee.js');

const customer = require('./AccountInformation/AccountInfo.js');

const transaction = require('./Transactions/Transaction.js');

const stripe = require('./Stripe/Stripe.js')

const delivery = require('./Delivery/Delivery.js')

const rateLimit = require('express-rate-limit');

//Cross Origin Resource Sharing
app.use(cors({

  origin: '*',

  methods: 'GET,POST,DELETE,PUT,OPTIONS',
  
  allowedHeaders: 'Content-Type, Authorization',

}));

//Rate Limiter On Each Route
const generalLimiter = rateLimit({

  windowMs: 60 * 1000, 

  max: 200, 

  message: { error: "Too many requests. Please try again later." },

  standardHeaders: true, 

  legacyHeaders: false,

});

//Apply Limiter
app.use(generalLimiter)

//Apply Unique ID To Logger
app.use(logWithRequestId);

//Routes
app.use('/api/stripe', stripe)

app.use('/api/delivery', delivery)

app.use('/api/robot', robot);

app.use('/api/inventory', inventory);

app.use('/api/authentication', authentication);

app.use('/api/shoppingcart', shoppingcart);

app.use('/api/address', address);

app.use('/api/employee', employee);

app.use('/api/customer', customer);

app.use('/api/transaction', transaction);

app.use('/uploads', express.static('./uploads'));

//Start server
app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);

});
