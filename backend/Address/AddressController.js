//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

//Gets the address associated with a customer 
const getAddress = (req, res) => {
    //Fetch the customerid
    const customerid = req.user.CustomerID

    //Get the address by joining the customeraddress and address relations
    const sql = "Select * From customeraddress, address Where customeraddress.customerid = ? and customeraddress.address = address.address"
    pool.query(sql, [customerid], (err, results)=>{
        if(err){
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results)
    })
}   

//Enable users to add an address
const addAddress = async (req, res) => {
    try {
        //Fetch the user id 
        const customerid = req.user.CustomerID

        //Information associated with the address input
        const {Address, Name} = req.body;
            
        // Get the connection from the pool
        connection = await pool.promise().getConnection(); 

        // Start a transaction
        await connection.beginTransaction();
            //Insert address and ignore error if duplicate
            const sqlQueryOne = 'INSERT INTO Address (Address) VALUES (?) ON DUPLICATE KEY UPDATE Address=Address;'
            await connection.query(
                sqlQueryOne, 
                [Address]
            );
        
            // Insert customer/address relationship into customeraddress
            const sqlQueryTwo = 'Insert Into customeraddress (Address,CustomerID, Name) Values (?,?,?)'
            await connection.query(
                sqlQueryTwo, 
                [Address, customerid, Name]
            );
    
        // Commit the transaction
        await connection.commit();
    
        // Release the connection back to the pool
        connection.release();

        res.status(200).json({ success: true });

    } catch (err) {
        if (connection) {
            // Rollback if there's an error
            await connection.rollback();
            connection.release();
        }

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "This address is already linked to this customer." });
        }

        return res.status(500).json({ error: err.message });
    }
};

//Delete the address 
const deleteAddress =  async(req,res)=>{
    try {
        let connection; 

        //Get the customer id
        const customerid = req.user.CustomerID

        //Get address primary key
        const {Address} = req.body;

        if(!Address){
            res.status(400).json({err:"invalid address"})
            return;
        }
            
        // Get the connection from the pool
        connection = await pool.promise().getConnection(); 

        // Start a transaction
        await connection.beginTransaction();
    
            // Delete address/customer association
            const sqlQueryOne = 'Delete From customeraddress Where customerid = ? And address = ?'
            await connection.query(
                sqlQueryOne, 
                [customerid, Address]
            );
        
            //Delete address if no-one is relying on it
            //Expensive Query
            const sqlQueryTwo = `DELETE FROM Address WHERE NOT EXISTS (SELECT 1 FROM customeraddress WHERE customeraddress.address = Address.address) AND NOT EXISTS (SELECT 1 FROM transactions WHERE transactions.TransactionAddress = Address.address);`;
            await connection.query(
                sqlQueryTwo, 
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
            return;
        }
    
        res.status(500).json({ error: err.message });
    }
}

//Format incoming address
function formatAddress(req, res, next) {
    if (!req.body.Address || req.body.Address === "") {
        return res.status(400).json({ error: "Address Not Found" });
    }

    const regex = /^\d+\s[A-Za-z0-9\s,.'-]+(?:[A-Za-z0-9\s,.'-]+)?(?:,\sSan\sJose,\sCalifornia\s\d{5}(-\d{4})?)?$/;

    if (!regex.test(req.body.Address)) {
        return res.status(400).json({ error: "Address Not Formatted Properly" });
    }

    next();
}



module.exports={deleteAddress, getAddress, addAddress, formatAddress}