// Import the database connection pool
const pool = require('../Database Pool/DBConnections');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const handleStripe = async (req, res) => {
    try {
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
        });

        // Send the Stripe checkout URL
        res.json({ url: session.url });

    } catch (e) {
        console.error("Error during Stripe checkout session creation:", e);
        res.status(500).json({ error: e.message || "Internal server error" });
    }
};

module.exports = { handleStripe };
