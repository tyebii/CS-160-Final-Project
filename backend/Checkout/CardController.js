//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const getCreditCard =  (req, res)=>{
    const customerid = req.user.customerid
    const sqlQuery = "Select * From CreditCard, CustomerCreditCards Where CustomerCreditCards.CustomerID = ? and CreditCard.CardNumber = CustomerCreditCards.CardNumber"
    pool.query(sqlQuery, [customerid],(err, results)=>{
        if(err){
            res.status(500).json({error:err.message})
        }
        res.status(200).json(results)
    })
}

const addCreditCard = async (req, res)=>{
        try {
            const customerid = req.user.customerid
            const {CardNumber, CardHolderFirst, CardHolderLast, SecurityCode} = req.body;
                
            // Get the connection from the pool
            connection = await pool.promise().getConnection(); 
    
            // Start a transaction
            await connection.beginTransaction();
        
            // Insert address
            const sqlQueryOne = 'Insert Ignore Into CreditCard(CardNumber,CardHolderFirst,CardHolderLast,SecurityCode) Values(?,?,?,?)'
            await connection.query(
                sqlQueryOne, 
                [CardNumber, CardHolderFirst, CardHolderLast, SecurityCode]
            );
        
            // Insert customer/address relation
            const sqlQueryTwo = 'Insert Ignore Into customercreditcards (CustomerID, CardNumber) Values (?,?)'
            await connection.query(
                sqlQueryTwo, 
                [customerid, CardNumber]
            );
        
            // Commit the transaction
            await connection.commit();
        
            // Release the connection back to the pool
            connection.release();
        
            res.status(200).json({ success: true });
    
        } catch (err) {
            console.error("Error:", err.message);
        
            if (connection) {
                // Rollback if there's an error
                await connection.rollback();
                connection.release();
            }
        
            res.status(500).json({ error: "Internal Server Error" });
        }
}

const deleteCreditCard = async(req, res)=>{
    try {
        const customerid = req.user.customerid
        const {CardNumber} = req.body;
            
        // Get the connection from the pool
        connection = await pool.promise().getConnection(); 

        // Start a transaction
        await connection.beginTransaction();
    
        // Delete address/customer association
        const sqlQueryOne = `
        DELETE FROM customercreditcards 
        WHERE customerid = ? AND cardnumber = ?
        `;
        await connection.query(
            sqlQueryOne, 
            [customerid, CardNumber]
        );
    
        //Delete address if no-one is relying on it
        const sqlQueryTwo = `
        DELETE FROM CreditCard a 
        WHERE NOT EXISTS (
            SELECT 1 FROM customercreditcards ca
            WHERE ca.cardnumber = a.cardnumber
        )
        `;
        await connection.query(
            sqlQueryTwo
        );
    
        // Commit the transaction
        await connection.commit();
    
        // Release the connection back to the pool
        connection.release();
    
        res.status(200).json({ success: true });

    } catch (err) {
        console.error("Error:", err.message);
    
        if (connection) {
            // Rollback if there's an error
            await connection.rollback();
            connection.release();
        }
    
        res.status(500).json({ error: err.message });
    }
}

module.exports = {getCreditCard, addCreditCard, deleteCreditCard}