const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode, validateAddress, validateName} = require('../Utils/Formatting')

//Gets Customer Addresses
const getAddress = (req, res) => {

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const sqlQuery = "Select * From customeraddress, address Where customeraddress.customerid = ? and customeraddress.address = address.address"

    pool.query(sqlQuery, [customerID], (error, results)=>{

        if(error){

            console.log("Error Accessing Customer Addresses: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Customer Addresses'});

        }

        return res.status(statusCode.OK).json(results)

    })
}   

//Adding Customer-Address Relationship
const addAddress = async (req, res) => {

    try {

        const customerID = req.user?.CustomerID

        if(!validateID(customerID)){

            return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

        }

        let {address, name} = req.body;
            
        if(! await validateAddress(address)){

            return res.status(statusCode.BAD_REQUEST).json({error:"Address Is Invalid"})

        }

        if(!validateName(name)){

            return res.status(statusCode.BAD_REQUEST).json({error:"Name Is Invalid"})

        }

        const connection = await pool.promise().getConnection();

        await connection.beginTransaction();

            const sqlQueryOne = 'INSERT INTO Address (Address) VALUES (?) ON DUPLICATE KEY UPDATE Address=Address;'
            
            await connection.query(
                sqlQueryOne, 
                [address]
            );
        
            const sqlQueryTwo = 'Insert Into customeraddress (Address,CustomerID, Name) Values (?,?,?)'
            
            await connection.query(
                sqlQueryTwo, 
                [address, customerID, name]
            );
    
        await connection.commit();
    
        connection.release();

        return res.status(statusCode.OK).json({ success: true });

    } catch (error) {

        if (connection) {

            await connection.rollback();

            connection.release();

        }

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "This Address Is Already Linked To You." });
       
        }

        console.log("Error Adding An Address: " + error.message)

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error On Addition Of Address" });
    
    }
};

//Delete The address Associated With A Customer
const deleteAddress =  async(req,res)=>{

    try {

        const customerID = req.user?.CustomerID

        if(!validateID(customerID)){

            return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

        }

        const {address} = req.body;
            
        if(!await validateAddress(addAddressddress)){

            return res.status(statusCode.BAD_REQUEST).json({error:"Address Is Invalid"})

        }
            
        const connection = await pool.promise().getConnection(); 

        await connection.beginTransaction();
    
            const sqlQueryOne = 'Delete From customeraddress Where customerid = ? And address = ?'
            await connection.query(
                sqlQueryOne, 
                [customerID, address]
            );
        
            const sqlQueryTwo = `DELETE FROM Address WHERE NOT EXISTS (SELECT 1 FROM customeraddress WHERE customeraddress.address = Address.address) AND NOT EXISTS (SELECT 1 FROM transactions WHERE transactions.TransactionAddress = Address.address);`;
            await connection.query(
                sqlQueryTwo, 
            );
    
        await connection.commit();
    
        connection.release();
    
        return res.status(statusCode.OK).json({ success: true });

    } catch (error) {

        if (connection) {

            await connection.rollback();

            connection.release();

        }

        console.log("Error Deleting An Address: " + error.message)

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error On Deletion Of Address" });
    
    }
}



module.exports={deleteAddress, getAddress, addAddress}