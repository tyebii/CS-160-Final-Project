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
                        name: (storeItem[0].ProductName + ": " + storeItem[0].ItemID),
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
            expires_at: Math.floor(Date.now() / 1000) + 1800,
            line_items: lineItems,
            success_url: 'http://localhost:3300/success',
            cancel_url: 'http://localhost:3300/fail',
            metadata: {
                transaction_id: req.body.TransactionID,  // Make sure this is populated
                in_store: req.body.InStore,
                customer_id: req.user.CustomerID
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

const addTransaction = async (req, res, next) => {
    const { TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate } = req.body;
    let CustomerID = req.user.CustomerID;

    console.log(CustomerID);
    
    // Generate a Unique TransactionID
    let TransactionID;
    do {
        TransactionID = uuidv4();
    } while (await transactionIDExists(TransactionID));

    const formattedTransactionDate = new Date(TransactionDate).toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Get a connection from the pool
        const connection = await pool.promise().getConnection(); 

        try {
            // Start a transaction
            await connection.beginTransaction();

            // Insert Transaction into Database
            await connection.query(
                `INSERT INTO Transactions 
                 (CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, formattedTransactionDate]
            );

            // Update The Inventory
            await connection.query(
                `UPDATE Inventory 
                 JOIN ShoppingCart ON Inventory.ItemID = ShoppingCart.ItemID 
                 SET Inventory.Quantity = Inventory.Quantity - ShoppingCart.OrderQuantity 
                 WHERE ShoppingCart.CustomerID = ?`,
                [CustomerID]
            );

            // Commit the transaction if everything is successful
            await connection.commit();
            console.log("Success in Adding");

            req.body.TransactionID = TransactionID;
            next();
        } catch (err) {
            // Rollback transaction on error
            await connection.rollback();
            console.error("Transaction Failed:", err.message);
            res.status(500).json({ error: err.message });
            return; // Stop further execution
        } finally {
            // Release connection back to the pool
            connection.release();
        }
    } catch (err) {
        console.error("Database Connection Failed:", err.message);
        res.status(500).json({ error: err.message });
        return; // Stop further execution
    }
};

//Check if TransactionID is taken
function transactionIDExists(transactionID) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Transactions WHERE TransactionID = ?', [transactionID], (err, results) => {
            if (err) {
                reject(err); // Handle database error
            } else {
                resolve(results.length > 0); // Resolve with true if found, false otherwise
            }
        });
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

    try {
        const session = event.data.object;

        switch (event.type) {
            case 'checkout.session.completed': {
                let connection;
                try {
                    connection = await pool.promise().getConnection();
                    await connection.beginTransaction(); // Begin transaction

                    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                    console.log("PaymentIntent status:", paymentIntent.status);

                    const transactionStatus = paymentIntent.status === 'succeeded'
                        ? (session.metadata.in_store ? 'Complete' : 'Out For Delivery')
                        : 'Failed';

                    const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
                    const charge = charges.data.length > 0 ? charges.data[0] : {}; // Ensure charge exists

                    const sqlQuery = `
                        UPDATE Transactions 
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
                        paymentIntent.id,
                        paymentIntent.payment_method,
                        paymentIntent.status,
                        charge.receipt_url || null,
                        session.currency,
                        session.amount_total / 100,
                        transactionStatus,
                        session.metadata.transaction_id
                    ];

                    await connection.query(sqlQuery, values);

                    if (paymentIntent.status !== 'succeeded') {
                        await connection.query(
                            `UPDATE Inventory 
                             JOIN ShoppingCart ON Inventory.ItemID = ShoppingCart.ItemID 
                             SET Inventory.Quantity = Inventory.Quantity + ShoppingCart.OrderQuantity 
                             WHERE ShoppingCart.CustomerID = ?`,
                            [session.metadata.customer_id]
                        );
                    }else{
                        await connection.query("DELETE FROM shoppingcart WHERE customerid = ?", [session.metadata.customer_id])
                    }
                    await connection.commit(); // Commit changes
                    console.log("Transaction updated successfully.");
                } catch (err) {
                    if (connection) await connection.rollback(); // Rollback transaction
                    console.error("Error updating transaction:", err.message);
                } finally {
                    if (connection) connection.release();
                }
                break;
            }

            case 'checkout.session.expired': {
                let connection;
                try {
                    connection = await pool.promise().getConnection();
                    await connection.beginTransaction(); // Begin transaction

                    const sqlQueryFailed = `
                        DELETE FROM Transactions
                        WHERE TransactionID = ?;
                    `;
                    const valuesFailed = [session.metadata.transaction_id];
                    await connection.query(sqlQueryFailed, valuesFailed);

                    await connection.query(
                        `UPDATE Inventory 
                         JOIN ShoppingCart ON Inventory.ItemID = ShoppingCart.ItemID 
                         SET Inventory.Quantity = Inventory.Quantity + ShoppingCart.OrderQuantity 
                         WHERE ShoppingCart.CustomerID = ?`,
                        [session.metadata.customer_id]
                    );

                    await connection.commit(); // Commit changes
                    console.log("Expired session transaction deleted successfully.");
                } catch (err) {
                    if (connection) await connection.rollback();
                    console.error("Error deleting expired transaction:", err.message);
                } finally {
                    if (connection) connection.release();
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("Error handling webhook event:", err.message);
        res.status(500).send("Internal Server Error");
    }
};



module.exports = { handleStripe, addTransaction, handleHook };
