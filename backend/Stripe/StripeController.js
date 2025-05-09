const pool = require('../Database Pool/DBConnections');

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const {statusCode, validateAddress, validateID} = require("../Utils/Formatting")

const {transactionIDExists} = require('../Utils/ExistanceChecks')

const {generateUniqueID} = require('../Utils/Generation')

const {logger} = require('../Utils/Logger'); 

//This Creates A Stripe Checkout Section
const handleStripe = async (req, res) => {

    logger.info("Handling Stripe...")

    try {

        if (!process.env.STRIPE_PRIVATE_KEY) {

            logger.error("Error Stripe Private Key")

            throw new Error(`Error Creating Stripe Checkout Session`);

        }

        let weight = req.weight;

        let lineItems = [];
        
        logger.info("Populating Stripe Cart")
    
        const items = req.items;
        
        for (let i = 0; i < items.length; i++) {

            const item = items[i];
            
            lineItems.push({

                price_data: {

                currency: 'usd',

                product_data: {

                    name: `${item.ProductName}: ${item.ItemID}`

                },

                unit_amount: Math.round(item.Cost * 100),

                },

                quantity: item.OrderQuantity,

            });

        }


        lineItems.push({

            price_data: {

                currency: 'usd',

                product_data: { name: 'Delivery' },

                unit_amount: (weight < 20 || req.body.TransactionAddress == "272 E Santa Clara St, San Jose, CA 95112")? 0 : 1000, 

            },

            quantity: 1

        });

        logger.info("Successfully Loaded Stripe Order" )

        logger.info("In Store: " + (req.body.TransactionAddress == "272 E Santa Clara St, San Jose, CA 95112"))

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],

            mode: 'payment',

            expires_at: Math.floor(Date.now() / 1000) + 1800,

            line_items: lineItems,

            success_url: 'http://localhost:3300/orders',

            cancel_url: 'http://localhost:3300/shoppingcart',

            metadata: {
                
                in_store: (req.body.TransactionAddress === "272 E Santa Clara St, San Jose, CA 95112" || weight > 200).toString(),

                customer_id: req.user.CustomerID,

                transaction_id: req.transactionID

            },

        });

        logger.info("Session Created")

        return res.json({ url: session.url });
    
    } catch (error) {

        logger.error("Error While Handling Stripe: " + error.message)

        if (!res.headersSent) { 

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Creating Checkout Session" });

        }

    }

};

//Adds A Transaction
const addTransaction = async (req, res, next) => {

    logger.info("Adding Transaction");

    const { TransactionAddress } = req.body;

    const customerID = req.user.CustomerID;

    if (!validateID(customerID)) {

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Invalid Customer ID" });

    }

    if (!validateAddress(TransactionAddress)) {

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Invalid Transaction Address" });

    }

    let connection;

    let transactionID

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

        const [items] = await connection.query(

            `SELECT * FROM Inventory 

             JOIN Shoppingcart ON Inventory.ItemID = Shoppingcart.ItemID 

             WHERE Shoppingcart.CustomerID = ?`,

            [customerID]

        );

        if (items.length === 0) {

            logger.error("Empty Shopping Cart");

            return res.status(statusCode.BAD_REQUEST).json({ error: "No shopping cart to transact" });

        }

        let weight = 0;

        let cost = 0;

        for (const item of items) {

            weight += item.Weight * item.OrderQuantity;

            cost += item.Cost * 100 * item.OrderQuantity;

        }

        if (cost < 50) {

            logger.error("Cost Too Low For A Stripe Transaction");

            return res.status(statusCode.BAD_REQUEST).json({ error: "Transaction must be greater than $0.5" });

        }

        if (TransactionAddress != "272 E Santa Clara St, San Jose, CA 95112" && weight > 200) {

            logger.error("Weight Too High For A Delivery");

            return res.status(statusCode.BAD_REQUEST).json({ error: "Transaction must be less than 200 lbs for delivery" });
        
        }

        try {

            transactionID = await generateUniqueID(transactionIDExists);
        
        } catch (error) {
        
            logger.error("Error Generating Transaction ID: " + error.message);
        
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Creating Unique TransactionID" });
        
        }

        await connection.query(

            `INSERT INTO Transactions 
        
             (CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate) 
        
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
        
            [customerID, transactionID, cost / 100, weight, TransactionAddress, "In Progress", new Date()]
        
        );

        const values = items.map(item => [

            transactionID,
        
            item.ItemID,
        
            item.ProductName,
        
            item.OrderQuantity,
        
            item.Cost,
        
            item.ImageLink
        
        ]);
        
        await connection.query(
        
            `INSERT INTO TransactionItems 
        
             (TransactionID, ItemID, ProductName, Quantity, PriceAtPurchase, ImageLink) 
        
             VALUES ?`,
        
            [values]
        
        );

        req.items = items;

        req.transactionID = transactionID

        req.weight = weight

        logger.info("Inventory Update And Transaction Addition Successful");

        await connection.commit();

        connection.release();

        next();

    } catch (error) {

        logger.error("Error While Adding Transaction And Updating Inventory: " + error.message);


        if (connection) {

            try {

                logger.info("Rolling Back Connection");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Error During Rollback: " + rollbackError.message);

            }

            try {

                logger.info("Releasing Connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Error Releasing Connection: " + releaseError.message);

            }

        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Adding Transaction And Updating Inventory" });

    }

};

//Stripe Webhook
const handleHook = async (req, res) => {

    logger.info("Handling Webhook Response")

    const sig = req.headers['stripe-signature'];

    let event;

    try {

        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    } catch (error) {

        logger.error(`Webhook Signature Verification Failed: ${error.message}`);

        return res.status(statusCode.BAD_REQUEST).json({error:"Internal Server Error On Stripe Webhook"})

    }

    try {

        const session = event.data.object;

        switch (event.type) {

            case 'checkout.session.completed': {

                logger.info("Transaction Was Completed")

                let connection;

                try {

                    connection = await pool.promise().getConnection();

                    await connection.beginTransaction();

                        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

                        if (paymentIntent.status !== 'succeeded'){

                            const sqlQueryFailed = `

                                UPDATE Transactions

                                SET TransactionStatus = 'Failed', TransactionFailure = 'Payment Was Not Processed Correctly'

                                WHERE TransactionID = ?;
        
                            `;
        
                            const valuesFailed = [session.metadata.transaction_id];
        
                            await connection.query(sqlQueryFailed, valuesFailed);

                            logger.error("Checkout Complete But Failed Payment")

                            await connection.commit(); 

                            connection.release();

                            try {

                                logger.info("Attempting to refund due to payment failure...");
                        
                                const refund = await stripe.refunds.create({

                                    payment_intent: session.payment_intent

                                });

                                logger.info("Refund issued. Refund ID: " + refund.id);

                            } catch (refundError) {

                                logger.error("Error refunding after failed payment: " + refundError.message);

                            }

                            return res.sendStatus(200);


                        }

                        const transactionStatus = paymentIntent.status === 'succeeded'

                            ? (session.metadata.in_store === 'true' ? 'Complete' : 'Pending Delivery'):'In Progress';

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

                        await connection.query(

                            `UPDATE Inventory

                            JOIN TransactionItems ON Inventory.ItemID = TransactionItems.ItemID

                            JOIN Transactions ON TransactionItems.TransactionID = Transactions.TransactionID

                            SET Inventory.Quantity = Inventory.Quantity - TransactionItems.Quantity

                            WHERE Transactions.TransactionID = ?`,
                        
                            [session.metadata.transaction_id]
                        
                        );

                        await connection.query(

                            `DELETE FROM ShoppingCart

                             WHERE CustomerID = ?

                               AND ItemID IN (

                                 SELECT TI.ItemID

                                 FROM TransactionItems TI

                                 WHERE TI.TransactionID = ?
                                 
                               )`,

                            [session.metadata.customer_id, session.metadata.transaction_id]

                        );

                    await connection.commit(); 

                    connection.release();

                    logger.info("Successfully Handled The Webhook Request")

                    break

                } catch (error) {

                    logger.error("Error While Handling Hook: " + error.message)

                    if (connection) {
            
                        try {
            
                            logger.info("Rolling Back Connection");
            
                            await connection.rollback();
            
                        } catch (rollbackError) {
            
                            logger.error("Error During Rollback: " + rollbackError.message);
            
                        }
                    
                        try {
            
                            logger.info("Releasing Connection");
            
                            connection.release();
            
                        } catch (releaseError) {
            
                            logger.error("Error Releasing Connection: " + releaseError.message);
            
                        }
                        
                    }

                    try {

                        logger.info("Attempting to refund payment due to error...");
                    
                        if (session.payment_intent) {

                            const refund = await stripe.refunds.create({

                                payment_intent: session.payment_intent

                            });

                            logger.info("Refund issued. Refund ID: " + refund.id);
                            
                        } else {

                            logger.error("No PaymentIntent found in session to refund.");

                        }
                    
                    } catch (refundError) {

                        logger.error("Error refunding payment: " + refundError.message);

                        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Error Refunding After DB Error" });

                    }

                    
                    if (

                        error.code === 'ER_SIGNAL_EXCEPTION' ||
                         
                        error.sqlState === '45000' ||      

                        error.errno === 3819       
                                      
                      ) {

                        logger.error("Inventory quantity constraint violated - not enough stock");
                
                        try {

                            logger.info("Updating Transaction to Failed due to Inventory Constraint");
                        
                            const newConnection = await pool.promise().getConnection();
                        
                            try {

                                await newConnection.beginTransaction();
                        
                                await newConnection.query(`

                                    UPDATE Transactions

                                    SET TransactionStatus = 'Failed', TransactionFailure = 'Not Enough Stock'

                                    WHERE TransactionID = ?;

                                `, [session.metadata.transaction_id]);
                        
                                await newConnection.commit();

                                logger.info("Transaction marked as Failed");
                        
                            } catch (innerError) {

                                logger.error("Error Updating Transaction Status After Constraint Violation: " + innerError.message);
                        
                                try {

                                    await newConnection.rollback();

                                    logger.info("Rolled back after failure during marking failed");

                                } catch (rollbackInnerError) {

                                    logger.error("Error rolling back after update failure: " + rollbackInnerError.message);

                                }
                        
                            } finally {

                                newConnection.release();

                            }
                        
                        } catch (connError) {

                            logger.error("Error getting new connection to mark Transaction Failed: " + connError.message);

                        }
                
                    }

                    return res.sendStatus(200);

                }

            }

        case 'checkout.session.expired': {

            logger.info("Transaction Expired")

            let connection;

            try {

                logger.info("Removing The Transaction And Updating Inventory")

                connection = await pool.promise().getConnection();

                await connection.beginTransaction();

                    const sqlQueryFailed = `
                            
                        Delete From Transactions"
        
                        WHERE TransactionID = ?;

                    `;

                    const valuesFailed = [session.metadata.transaction_id];

                    await connection.query(sqlQueryFailed, valuesFailed);

                await connection.commit();

                connection.release();

                logger.info("Successfully Removed Transaction And Updated Inventory")

                break

            } catch (error) {

                logger.error("Error While Handling Hook: " + error.message)

                if (connection) {
        
                    try {
        
                        logger.info("Rolling Back Connection");
        
                        await connection.rollback();
        
                    } catch (rollbackError) {
        
                        logger.error("Error During Rollback: " + rollbackError.message);
        
                    }
                
                    try {
        
                        logger.info("Releasing Connection");
        
                        connection.release();
        
                    } catch (releaseError) {
        
                        logger.error("Error Releasing Connection: " + releaseError.message);
        
                    }
                    
                }

                return res.sendStatus(200);

            } 

        }

    }

    logger.info("Successful Handling Of The Webhook")

    return res.sendStatus(statusCode.OK);

    } catch (error) {

        logger.error("Error Handling Webhook Event:", error.message);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error With Webhook"});

    }

};

module.exports = { handleStripe, addTransaction, handleHook };