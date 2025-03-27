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
        const { Address, City, Zip, Street, State } = req.body;
            
        // Get the connection from the pool
        connection = await pool.promise().getConnection(); 

        // Start a transaction
        await connection.beginTransaction();
        

        //Insert address and ignore error if duplicate
        const sqlQueryOne = 'Insert Ignore Into Address(Address,City,Zip,Street,State) Values(?,?,?,?,?)'
        await connection.query(
            sqlQueryOne, 
            [Address, City, Zip, Street, State]
        );
    
        // Insert customer/address relationship into customeraddress
        const sqlQueryTwo = 'Insert Ignore Into customeraddress (Address,CustomerID) Values (?,?)'
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
            return;
        }
    
        res.status(500).json({ error: "Internal Server Error" });
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
    if(!req.body.Address || !req.body.City || !req.body.State || !req.body.Zip || !req.body.Street){
       return res.status(400).json({err: "invalid input"})
    }
    req.body.Address = req.body.Address.trim()
    req.body.City = req.body.City.trim()
    req.body.State = req.body.State.trim()
    req.body.Zip = req.body.Zip.trim()
    req.body.Street = req.body.Street.trim()
    const { Address, City, Zip, Street, State } = req.body;
    

    // Validate Address
    if (typeof Address !== 'string' || Address.trim() === '') {
        return res.status(400).json({ error: 'Address is required and must be a non-empty string.' });
    }

    // Validate City
    const cityRegex = /^[A-Za-z\s]+$/;
    if (typeof City !== 'string' || !cityRegex.test(City.trim())) {
        return res.status(400).json({ error: 'City must be a non-empty string containing only letters and spaces.' });
    }

    // Validate Zip
    const zipRegex = /^\d{5}$/;
    if (typeof Zip !== 'string' || !zipRegex.test(Zip.trim())) {
        return res.status(400).json({ error: 'Zip code must be in the format XXXXX.' });
    }

    // Validate Street
    if (typeof Street !== 'string' || Street.trim() === '') {
        return res.status(400).json({ error: 'Street is required and must be a non-empty string.' });
    }

    // Validate State
    const stateRegex = /^[A-Za-z]{2}$/;
    if (typeof State !== 'string' || !stateRegex.test(State.trim())) {
        return res.status(400).json({ error: 'State must be a two-letter abbreviation.' });
    }

    next();
}


module.exports={deleteAddress, getAddress, addAddress, formatAddress}