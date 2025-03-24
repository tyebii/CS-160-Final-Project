const express = require('express');
const router = express.Router();
const pool = require('../Database Pool/DBConnections')

router.get('/transactions', (req, res) => {
    pool.query('SELECT * FROM transactions', (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ error: 'Failed to fetch transactions' });
        }
        res.json(results);
    });
});

router.post('/transactions', (req, res) => {
    const { customer_id, cost, weight, address, state, robot_id } = req.body;
    
    pool.query(
        `INSERT INTO transactions 
        (customer_id, cost, weight, address, state, purchase_date, robot_id)
        VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
        [customer_id, cost, weight, address, state, robot_id],
        (err, results) => {
            if (err) {
                console.error('Error creating transaction:', err);
                return res.status(500).json({ error: 'Failed to create transaction' });
            }
            res.status(201).json({
                transaction_id: results.insertId,
                message: 'Transaction created successfully'
            });
        }
    );
});

module.exports = router;