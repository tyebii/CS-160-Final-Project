// Import the database connection pool
const pool = require('../Database Pool/DBConnections');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { v4: uuidv4 } = require('uuid');


const handleStripe = async (req, res) => {
    try {
        console.log(req.body)
        // Ensure Stripe private key is loaded
        if (!process.env.STRIPE_PRIVATE_KEY) {
            throw new Error("Stripe private key is not defined in environment variables.");
        }

        let weight = 0;
        let lineItems = [];

        for (const item of req.body.items) {
            // Fetch item details from the database
            const [storeItem] = await pool.promise().query(
                'SELECT * FROM inventory WHERE ItemID = ?', 
                [item.ItemID]
            );

            // Check if item exists
            if (!storeItem || storeItem.length === 0) {
                res.status(400).json({ error: `Item with ID ${item.ItemID} not found.` });
                return; // Stop further execution
            }

            // Accumulate weight based on the item's cost and quantity
            weight += storeItem[0].Cost * item.Quantity;

            // Add the item to the Stripe checkout session
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: storeItem[0].ProductName,
                    },
                    unit_amount: storeItem[0].Cost * 100, // Convert to cents for Stripe
                },
                quantity: item.Quantity,
            });
        }

        // Add delivery fee based on total weight
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Delivery' },
                unit_amount: weight <= 20 ? 0 : 1000, // $10 if weight <= 20, otherwise free
            },
            quantity: 1
        });

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: 'http://localhost:3300/success',
            cancel_url: 'http://localhost:3300/fail',
            metadata: {
                transaction_id: req.body.TransactionID, 
            }
        });

        // Send the Stripe checkout URL
        res.json({ url: session.url });
        return;

    } catch (e) {
        console.error("Error during Stripe checkout session creation:", e);
        if (!res.headersSent) { // Ensure headers are not already sent
            res.status(500).json({ error: e.message || "Internal server error" });
            return;
        }
    }
};

const addTransaction = (req,res, next) => {
    const {TransactionCost, TransactionWeight,TransactionAddress,TransactionStatus,TransactionDate} = req.body
    let CustomerID = req.user.CustomerID
    //Unique ID
    let TransactionID = uuidv4(); // Generates a cryptographically safe unique customer ID'
                
    //In case of collisions
    while(transactionIDExists(TransactionID)){
        TransactionID = uuidv4();
    }

    const formattedTransactionDate = new Date(TransactionDate).toISOString().slice(0, 19).replace('T', ' ');

    pool.query('Insert Into Transactions(CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate) Values (?,?,?,?,?,?,?)', [CustomerID,TransactionID,TransactionCost, TransactionWeight,TransactionAddress,TransactionStatus,formattedTransactionDate], (err)=>{
        if(err){
            console.log(err.message)
            return res.status(500).json({err:err.message});
        }
        req.body.TransactionID = TransactionID;
        next()
    })
}

//Check if CustomerID is taken
function transactionIDExists(transactionID){
    pool.query('Select * From Transactions Where TransactionID = ?', [transactionID], (err, results) => {
        if (err || results.length != 0) {
            return true;
        }
        return false
    });
}

const handleHook = (req, res) => {

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            console.log('PaymentIntent was successful!', event.data.object);
            break;
        case 'payment_intent.payment_failed':
            console.log('PaymentIntent failed.', event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).send('Received');
}

module.exports = { handleStripe, addTransaction, handleHook };
