const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode, validateAddress, validateName} = require('../Utils/Formatting')

const logger = require('../Utils/Logger'); 

//Gets Customer Addresses
const getAddress = (req, res) => {

    logger.info("Fetching Addresses Associated With Customer")

    const customerID = req.user?.CustomerID

    if(!validateID(customerID)){

        logger.error("CustomerID Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

    }

    const sqlQuery = "Select * From customeraddress, address Where customeraddress.customerid = ? and customeraddress.address = address.address"

    pool.query(sqlQuery, [customerID], (error, results)=>{

        if(error){

            logger.error("Error Accessing Customer Addresses: " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Customer Addresses'});

        }

        logger.info("Addresses Fetched For Customer")

        return res.status(statusCode.OK).json(results)

    })
}   

//Adding Customer-Address Relationship
const addAddress = async (req, res) => {

    logger.info("Adding Address To Database")

    let connection;

    try {

        const customerID = req.user?.CustomerID

        if(!validateID(customerID)){

            logger.error("CustomerID Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

        }

        let {address, name} = req.body;
            
        if(! await validateAddress(address)){

            logger.error("Address Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"Address Is Invalid"})

        }

        if(!validateName(name)){

            logger.error("Name Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"Name Is Invalid"})

        }

        connection = await pool.promise().getConnection();

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

        logger.info("Completed The Addition Of The Address")

        return res.status(statusCode.OK).json({ success: true });

    } catch (error) {

        logger.error("Error While Adding Address: " + error.message)

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

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error On Addition Of Address" });
    
    }

};

//Delete The address Associated With A Customer
const deleteAddress =  async (req,res)=>{

    const {address} = req.params

    logger.info("Delete Address From Database")

    let connection;

    try {

        const customerID = req.user?.CustomerID

        if(!validateID(customerID)){

            logger.error("CustomerID Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

        }
            
        if(!await validateAddress(address)){

            logger.error("Address Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"Address Is Invalid"})

        }
            
        connection = await pool.promise().getConnection(); 

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

        logger.info("Completed The Deletion Of The Address")
    
        return res.status(statusCode.OK).json({ success: true });

    } catch (error) {

        if (connection) {

            try {

                logger.info("Rolling Back Connection");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Error during rollback: " + rollbackError.message);

            }
        
            try {

                logger.info("Releasing Connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Error releasing connection: " + releaseError.message);

            }
            
        }

        logger.error("Error Deleting An Address: " + error.message)

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error On Deletion Of Address" });
    
    }
}



module.exports={deleteAddress, getAddress, addAddress}