// Import the database connection pool
const pool = require('../Database Pool/DBConnections');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const handleStripe = async (req, res) => {
    try {
        // Logging to ensure the environment variable is loaded correctly
        if (!process.env.STRIPE_PRIVATE_KEY) {
            throw new Error("Stripe private key is not defined in environment variables.");
        }


        // Use Promise.all to process all items in parallel
        const lineItems = await Promise.all(req.body.items.map(async (item) => {
            const [storeItem] = await pool.promise().query('SELECT * FROM inventory WHERE ItemID = ?', [item.ItemID]);

            // Check if item exists in the database
            if (!storeItem || storeItem.length === 0) {
                throw new Error(`Item with ID ${item.ItemID} not found`);
            }
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: storeItem[0].ProductName,
                    },
                    unit_amount: storeItem[0].Cost * 100,  // Convert to cents for Stripe
                },
                quantity: item.Quantity,
            };
        }));

        console.log("Request body:", req.body);
        console.log("Received Weight:", req.body.Weight, "Type:", typeof req.body.Weight);

        const weight = parseFloat(req.body.Weight);

        if (!req.body.Weight || isNaN(weight)) {
            throw new Error("Invalid weight value. Ensure weight is included and is a number.");
        }

        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery'
                },
                unit_amount: weight <= 20 ? 0 : 1000, 
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
        });

        // Respond with the URL for the Stripe checkout page
        res.json({ url: session.url });

    } catch (e) {
        // Log the error and send the response with error message
        console.error("Error during Stripe checkout session creation:", e);
        res.status(500).json({ error: e.message || "Internal server error" });
    }
};

module.exports = { handleStripe };
