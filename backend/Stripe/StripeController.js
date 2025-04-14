const pool = require('../Database Pool/DBConnections');

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const {statusCode} = require("../Utils/Formatting")

const {transactionIDExists} = require('../Utils/ExistanceChecks')

const {generateUniqueID} = require('../Utils/Generation')

//This Creates A Stripe Checkout Section
const handleStripe = async (req, res) => {

    let connection 

    try {

        if (!process.env.STRIPE_PRIVATE_KEY) {

           throw new Error(`Error Creating Stripe Checkout Session`);

        }

        let weight = 0;

        let lineItems = [];

        let connection = req.connection;

            for (const item of req.body.items) {

                const [storeItem] = await connection.query('SELECT * FROM inventory WHERE ItemID = ?', [item.ItemID]);

                if (storeItem == null || storeItem.length === 0) {

                    throw new Error(`Item with ID ${item.ItemID} Not Found.`);

                }

                weight += storeItem[0].Cost * item.Quantity;

                lineItems.push({

                    price_data: {

                        currency: 'usd',

                        product_data: {

                            name: (storeItem[0].ProductName + ": " + storeItem[0].ItemID),

                        },

                        unit_amount: storeItem[0].Cost * 100, 

                    },

                    quantity: item.Quantity,

                });
            }

        await connection.commit()

        connection.release();

        lineItems.push({

            price_data: {

                currency: 'usd',

                product_data: { name: 'Delivery' },

                unit_amount: weight <= 20 ? 0 : 1000, 

            },
            quantity: 1

        });

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],

            mode: 'payment',

            expires_at: Math.floor(Date.now() / 1000) + 1800,

            line_items: lineItems,

            success_url: 'http://localhost:3300/orders',

            cancel_url: 'http://localhost:3300/orders',

            metadata: {

                transaction_id: req.body.TransactionID,  
                
                in_store: req.body.InStore,

                customer_id: req.user.CustomerID
            },
        });

        //const sessionDetails = await stripe.checkout.sessions.retrieve(session.id);

        return res.json({ url: session.url });
    
    } catch (error) {

        if(connection){

            await connection.rollback()

            connection.release()

        }

        console.error("Error During Stripe Checkout Creation: " + error.message);

        if (!res.headersSent) { 

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Creating Checkout Session" });

        }
    }
};

//Add Transaction 
const addTransaction = async (req, res, next) => {

    const { TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate } = req.body;

    let customerID = req.user.CustomerID;
    
    let transactionID;
    
    try{
        transactionID = await generateUniqueID(transactionIDExists);
    }catch(error){

        console.log("Error Generating Transaction ID" + error.message)

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Creating Unique TransactionID"})

    }

    const formattedTransactionDate = new Date(TransactionDate).toISOString().slice(0, 19).replace('T', ' ');

    try {

        const connection = await pool.promise().getConnection(); 

        try {

            await connection.beginTransaction();

                await connection.query(

                    `INSERT INTO Transactions 

                    (CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate) 

                    VALUES (?, ?, ?, ?, ?, ?, ?)`,

                    [customerID, transactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, formattedTransactionDate]

                );


                await connection.query(

                    `UPDATE Inventory 

                    JOIN ShoppingCart ON Inventory.ItemID = ShoppingCart.ItemID 

                    SET Inventory.Quantity = Inventory.Quantity - ShoppingCart.OrderQuantity 

                    WHERE ShoppingCart.CustomerID = ?`,

                    [customerID]
                );
            
            req.body.TransactionID = transactionID;

            req.connection = connection

            next();

        } catch (error) {

            if(connection){

                await connection.rollback();

                connection.release();
            }

            console.error("Update And Addition Of Transaction Failed: ", error.message);

            res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Adding Transaction"});

            return;
        } 
    } catch (error) {
        console.error("Database Connection Failed:", error.message);

        res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Adding Transaction"});

        return;
    }
};

//Stripe Webhook
const handleHook = async (req, res) => {

    const sig = req.headers['stripe-signature'];

    let event;

    try {

        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    } catch (error) {

        console.error(`Webhook Signature Verification Failed: ${error.message}`);

        return res.status(statusCode.BAD_REQUEST).json({error:"Internal Server Error On Stripe Webhook"})
    }

    try {

        const session = event.data.object;

        switch (event.type) {

            case 'checkout.session.completed': {

                let connection;

                try {

                    connection = await pool.promise().getConnection();

                    await connection.beginTransaction();

                        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

                        const transactionStatus = paymentIntent.status === 'succeeded'
                            ? (session.metadata.in_store === 'true' ? 'Complete' : 'Out For Delivery')
                            : 'Failed';

                        const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });

                        const charge = charges.data.length > 0 ? charges.data[0] : {};

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

                    await connection.commit(); 

                    connection.release();

                    break

                } catch (error) {

                    if (connection){

                        await connection.rollback();

                        connection.release();
                    }  

                    console.error("Error Updating Transaction:", error.message);

                    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Error Updating Transaction And Inventory"})
                }
            }

            case 'checkout.session.expired': {

                let connection;

                try {

                    connection = await pool.promise().getConnection();

                    await connection.beginTransaction();

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

                    await connection.commit();

                    connection.release();

                    break

                } catch (error) {

                    if (connection){
                        
                        await connection.rollback();

                        connection.release();

                    }

                    console.error("Error Deleting Expired Transaction:", error.message);

                    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:"Internal Server Removing Transaction"})
                } 
            }
        }

        return res.status(statusCode.OK);

    } catch (error) {

        console.error("Error Handling Webhook Event:", error.message);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error With Webhook"});

    }
};



module.exports = { handleStripe, addTransaction, handleHook };
