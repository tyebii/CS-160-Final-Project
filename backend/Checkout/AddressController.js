//Import the database connection pool
const pool = require('../Database Pool/DBConnections')

const getAddress = (req, res) => {
    const customerid = req.user.customerid
    const sql = "Select * From customeraddress, address Where customeraddress.customerid = ? and customeraddress.address = address.address"
    pool.query(sql, [customerid], (err, results)=>{
        if(err){
            res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(results)
    })
}   

const addAddress = async (req, res) => {
    try {
        const customerid = req.user.customerid
        const { Address, City, Zip, Street, State } = req.body;
            
        // Get the connection from the pool
        connection = await pool.promise().getConnection(); 

        // Start a transaction
        await connection.beginTransaction();
    
        // Insert address
        const sqlQueryOne = 'Insert Into Address(Address,City,Zip,Street,State) Values(?,?,?,?,?)'
        await connection.query(
            sqlQueryOne, 
            [Address, City, Zip, Street, State]
        );
    
        // Insert customer/address relation
        const sqlQueryTwo = 'Insert Into customeraddress (Address,CustomerID) Values (?,?)'
        await connection.query(
            sqlQueryTwo, 
            [Address, customerid]
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
};

const deleteAddress =  (req,res)=>{
    const { Address} = req.body;
    const sqlQueryOne = 'Delete From Address Where address = ?'
    pool.query(sqlQueryOne, [Address], (err, results) => {
        if(err){
            res.status(500).json({Error:err.message})
            return
        }
        res.status(200).json({success:"Removed from DB"})
    }
    );
}

module.exports={deleteAddress, getAddress, addAddress}