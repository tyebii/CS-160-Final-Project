const pool = require('../Database Pool/DBConnections');

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const {statusCode, validateAddress, validateTransactionStatus, validateID, validateCost, validateWeight, validatePastDate } = require("../Utils/Formatting")

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

        let weight = 0;

        let lineItems = [];
        
        logger.info("Populating Stripe Cart")
    
        const items = req.items;
        
        for (let i = 0; i < items.length; i++) {

            const item = items[i];
            
            weight += item.Weight * item.OrderQuantity;
            
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

                unit_amount: weight < 20 || req.body.TransactionAddress == "272 E Santa Clara St, San Jose, CA 95112"? 0 : 1000, 

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

            cancel_url: 'http://localhost:3300/orders',

            metadata: {

                transaction_id: req.body.TransactionID,  
                
                in_store: req.body.TransactionAddress == "272 E Santa Clara St, San Jose, CA 95112",

                customer_id: req.user.CustomerID

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

//Add Transaction 
const addTransaction = async (req, res, next) => {

    logger.info("Adding Transaction")

    const {TransactionAddress} = req.body;

    let customerID = req.user.CustomerID;

    if(!validateID(customerID)){

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Invalid Customer ID"})

    }

    if(!validateAddress(TransactionAddress)){

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Invalid Transaction Address"})

    }

    logger.info("Transaction Address: " + TransactionAddress)

    logger.info("CustomerID: " + customerID)
    
    let transactionID;
    
    try{

        transactionID = await generateUniqueID(transactionIDExists);

    }catch(error){

        logger.error("Error Generating Transaction ID" + error.message)

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Creating Unique TransactionID"})

    }

    try {

        const connection = await pool.promise().getConnection(); 

        try {

            await connection.beginTransaction();

                const [items] = await connection.query(

                    "SELECT * FROM Inventory JOIN Shoppingcart ON Inventory.ItemID = Shoppingcart.ItemID WHERE Shoppingcart.CustomerID = ?",
    
                    [req.user.CustomerID]
    
                );

                console.log(items)

                let weight = 0

                let cost = 0

                for(let i = 0; i < items.length; i++){

                    weight += items[i].Weight * items[i].OrderQuantity;

                    cost += items[i].Cost * 100 * items[i].OrderQuantity

                }

                if(cost < 50){

                    res.status(statusCode.BAD_REQUEST).json({error: "Transaction Must Be Greater Than $.5"})

                }

                await connection.query(

                    `INSERT INTO Transactions 

                    (CustomerID, TransactionID, TransactionCost, TransactionWeight, TransactionAddress, TransactionStatus, TransactionDate) 

                    VALUES (?, ?, ?, ?, ?, ?, ?)`,

                    [customerID, transactionID, cost / 100 , weight , TransactionAddress, "In Progress" , new Date()]

                );


                await connection.query(

                    `UPDATE Inventory 

                    JOIN ShoppingCart ON Inventory.ItemID = ShoppingCart.ItemID 

                    SET Inventory.Quantity = Inventory.Quantity - ShoppingCart.OrderQuantity 

                    WHERE ShoppingCart.CustomerID = ?`,

                    [customerID]

                );
            
            req.body.TransactionID = transactionID;

            req.items = items

            logger.info("Inventory Update And Transaction Addition Successful")

        await connection.commit()

        connection.release();

        next();

        } catch (error) {

            logger.error("Error While Adding Transaction And Updating Inventory: " + error.message)

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

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Adding Transaction And Updating Inventory"});

        } 

    } catch (error) {

        logger.error("Database Connection Failed:" + error.message);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Adding Transaction"});

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

                        const transactionStatus = paymentIntent.status === 'succeeded'

                            ? (session.metadata.in_store === 'true' ? 'Complete' : 'Pending Delivery')

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

                            logger.error("The Payment Was Not Successful. Updating Inventory")

                            await connection.query(

                                `UPDATE Inventory 

                                JOIN ShoppingCart ON Inventory.ItemID = ShoppingCart.ItemID 

                                SET Inventory.Quantity = Inventory.Quantity + ShoppingCart.OrderQuantity 

                                WHERE ShoppingCart.CustomerID = ?`,

                                [session.metadata.customer_id]

                            );

                        }else{

                            logger.info("The Payment Was Successful. Deleting Customer Shoppingcart")

                            await connection.query("DELETE FROM shoppingcart WHERE customerid = ?", [session.metadata.customer_id])
                        
                        }

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

                    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Error Updating Transaction And Inventory"})

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

                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:"Internal Server Removing Transaction And Updating Inventory"})

            } 

        }

    }

    logger.info("Successful Handling Of The Webhook")

    return res.status(statusCode.OK);

    } catch (error) {

        logger.error("Error Handling Webhook Event:", error.message);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error With Webhook"});

    }
};



module.exports = { handleStripe, addTransaction, handleHook };
