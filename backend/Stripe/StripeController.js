// Import the database connection pool
const pool = require('../Database Pool/DBConnections');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { v4: uuidv4 } = require('uuid');
const {clearShoppingCart} = require('../ShoppingCart/ShoppingCartController')
//This Creates A Stripe Checkout Section
const handleStripe = async (req, res) => {
    try {
        // Ensure Stripe private key is loaded
        if (!process.env.STRIPE_PRIVATE_KEY) {
            throw new Error("Stripe private key is not defined in environment variables.");
        }

        //Total Weight
        let weight = 0;

        //Items In The Body
        let lineItems = [];

        //Iterate Through Items In Body
        for (const item of req.body.items) {
            // Fetch item details from the database
            const [storeItem] = await pool.promise().query(
                'SELECT * FROM inventory WHERE ItemID = ?', 
                [item.ItemID]
            );

            // Check if item exists
            if (!storeItem || storeItem.length === 0) {
                return res.status(400).json({ error: `Item with ID ${item.ItemID} not found.` });
                
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
                    // Convert to cents for Stripe
                    unit_amount: storeItem[0].Cost * 100, 
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

        console.log("ID: ", req.body.TransactionID)
        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            line_items: lineItems,
            success_url: 'http://localhost:3300/success',
            cancel_url: 'http://localhost:3300/fail',
            metadata: {
                transaction_id: req.body.TransactionID,  // Make sure this is populated
                in_store: req.body.InStore
            }
        });

        const sessionDetails = await stripe.checkout.sessions.retrieve(session.id);
        console.log("Session metadata:", sessionDetails.metadata);

        // Send the Stripe checkout URL
        return res.json({ url: session.url });
    

    } catch (e) {
        console.error("Error during Stripe checkout session creation:", e);
        if (!res.headersSent) { // Ensure headers are not already sent
            return res.status(500).json({ error: e.message || "Internal server error" });
        }
    }
};

//Add A Transaction To The Database
const addTransaction = (req,res, next) => {
    //Transaction Items
    const {TransactionCost, TransactionWeight,TransactionAddress,TransactionStatus,TransactionDate} = req.body

    //CustomerID
    let CustomerID = req.user.CustomerID
    console.log(CustomerID)
    
    //Unique ID
    let TransactionID = uuidv4(); // Generates a cryptographically safe unique customer ID'
                
    //In case of collisions
    while(transactionIDExists(TransactionID)){
        TransactionID = uuidv4();
    }

    //Format The String For SQL
    const formattedTransactionDate = new Date(TransactionDate).toISOString().slice(0, 19).replace('T', ' ');

    //Insertion
    pool.query('Insert Into Transactions(CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate) Values (?,?,?,?,?,?,?)', [CustomerID,TransactionID,TransactionCost, TransactionWeight,TransactionAddress,TransactionStatus,formattedTransactionDate], (err)=>{
        if(err){
            console.log(err.message)
            return res.status(500).json({err:err.message});
        }
        req.body.TransactionID = TransactionID;
        console.log("Success in Adding")
        next()
    })
}

//Check if TransactionID is taken
function transactionIDExists(transactionID){
    pool.query('Select * From Transactions Where TransactionID = ?', [transactionID], (err, results) => {
        if (err || results.length != 0) {
            return true;
        }
        return false
    });
}

const handleHook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            
            // Fetch the PaymentIntent to check its final status
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

            console.log("PaymentIntent status:", paymentIntent.status);

            const transactionStatus = paymentIntent.status === 'succeeded' ? (session.metadata.in_store? 'Complete': 'Out For Delivery') : 'Failed';


            const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
            const charge = charges.data[0] || {}; // Get the first charge if exists


            const sqlQuery = `
                UPDATE transactions 
                SET 
                    StripeTransactionID = ?, 
                    PaymentMethod = ?, 
                    ChargeStatus = ?, 
                    ReceiptURL = ?, 
                    Currency = ?, 
                    AmountPaid = ?, 
                    TransactionStatus = ? 
                WHERE 
                    TransactionID = ?;
            `;
            
            const values = [
                paymentIntent.id, // StripeTransactionID
                paymentIntent.payment_method, // PaymentMethod
                paymentIntent.status, // ChargeStatus (e.g., 'succeeded', 'failed')
                charge.receipt_url || null, // ReceiptURL
                session.currency, // Currency
                session.amount_total / 100, // AmountPaid (Stripe uses cents)
                transactionStatus, // Final transaction status
                session.metadata.transaction_id // TransactionID (from metadata)
            ];

            pool.query(sqlQuery, values, (err, results) => {
                if (err) {
                    console.error('Database update error:', err.message);
                    return res.status(500).json({ err: err.message });
                }
                console.log('Transaction updated successfully:', results);
                return res.sendStatus(200);
            });
            return;
        case "checkout.session.expired":
            const sqlQueryFailed = `
                UPDATE transactions 
                SET 
                    TransactionStatus = ? 
                WHERE 
                    TransactionID = ?;
            `;
            
            const valuesFailed = [
                'Failed', // Final transaction status
                session.metadata.transaction_id // TransactionID (from metadata)
            ];

            pool.query(sqlQueryFailed, valuesFailed, (err, results) => {
                if (err) {
                    console.error('Database update error:', err.message);
                    return res.status(500).json({ err: err.message });
                }
                console.log('Transaction updated successfully:', results);
                return res.sendStatus(200);
            });
            return;
        default:
            console.log(`Unhandled event type: ${event.type}`);
            return res.sendStatus(200);
    }
};


module.exports = { handleStripe, addTransaction, handleHook };
