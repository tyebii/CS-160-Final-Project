const { add } = require('winston');
const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode, validateAddress, validateName} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger'); 

//Gets Customer Addresses
const getAddress = (req, res) => {

    const customerID = req.user?.CustomerID

    logger.info("Fetching Addresses Associated With Customer ID: " + customerID)

    if(!validateID(customerID)){

        logger.error("CustomerID " + customerID + " Format Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Has Invalid Format"})

    }

    const sqlQuery = "Select * From customeraddress, address Where customeraddress.customerid = ? and customeraddress.address = address.address"

    pool.query(sqlQuery, [customerID], (error, results)=>{

        if(error){

            logger.error("Error Accessing Customer Addresses With ID " + customerID + " : " + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error Fetching Customer Addresses'});

        }

        logger.info("Addresses Fetched For Customer With ID " + customerID)

        return res.status(statusCode.OK).json(results)

    })

}   

//Adding Customer-Address Relationship
const addAddress = async (req, res) => {

    let connection;

    try {

        const customerID = req.user?.CustomerID

        logger.info("Adding Address And Customer-Address Association To Database. The Customer ID Is " + customerID)

        if(!validateID(customerID)){

            logger.error("CustomerID " + customerID + " Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

        }

        let {address, name} = req.body;
            
        if(! await validateAddress(address)){

            logger.error("Address Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"Address Is Invalid"})

        }

        console.log(address)

        if(address === "272 East Santa Clara Street, San Jose, California 95113, United States" || address === "272 E Santa Clara St, San Jose, CA 95112"){

            logger.error("Cannot Add The Store")

            return res.status(statusCode.BAD_REQUEST).json({error:"Cannot Add The Store"})

        }

        if(!validateName(name)){

            logger.error("Name Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"Name Is Invalid"})

        }

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

            logger.info("Inserting Address")

            const sqlQueryOne = 'INSERT INTO Address (Address) VALUES (?) ON DUPLICATE KEY UPDATE Address=Address;'
            
            await connection.query(

                sqlQueryOne, 

                [address]
                
            );

            logger.info("Inserting Into Customer-Address Association")
        
            const sqlQueryTwo = 'Insert Into customeraddress (Address,CustomerID, Name) Values (?,?,?)'
            
            await connection.query(

                sqlQueryTwo, 

                [address, customerID, name]

            );
    
        await connection.commit();
    
        connection.release();

        logger.info("Completed The Addition Of The Address In The Address And Customer-Address Tables")

        return res.sendStatus(statusCode.OK);

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

        if (error.code === 'ER_DUP_ENTRY') {

            logger.warn("Duplicate address entry for customer");

            return res.status(statusCode.RESOURCE_CONFLICT).json({ error: "You have already added this address"});

          }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error On Addition Of Address" });
    
    }

};

//Delete The address Associated With A Customer
const deleteAddress =  async (req,res)=>{

    const {address} = req.params

    logger.info("Deleting Address From Database")

    let connection;

    try {

        const customerID = req.user?.CustomerID

        logger.info("Customer ID Recieved As " + customerID)

        if(!validateID(customerID)){

            logger.error("CustomerID Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Is Invalid"})

        }

        logger.info("Address Recieved As " + address)
            
        if(!await validateAddress(address)){

            logger.error("Address Is Invalid")

            return res.status(statusCode.BAD_REQUEST).json({error:"Address Is Invalid"})

        }

        if(address === "272 E Santa Clara St, San Jose, CA 95112"){

            logger.error("Cannot Delete The Store")

            return res.status(statusCode.BAD_REQUEST).json({error:"Store Address Cannot Be Deleted"})
        }
            
        connection = await pool.promise().getConnection(); 

        await connection.beginTransaction();

            logger.info("Deleting From Customer-Address Association")
    
            const sqlQueryOne = 'Delete From customeraddress Where customerid = ? And address = ?'

            await connection.query(

                sqlQueryOne, 

                [customerID, address]

            );

            logger.info("Deleting From Address Table If Hanging")
        
            const sqlQueryTwo = `DELETE FROM Address WHERE Address = ? AND NOT EXISTS (SELECT 1 FROM customeraddress WHERE customeraddress.address = Address.address) AND NOT EXISTS (SELECT 1 FROM transactions WHERE transactions.TransactionAddress = Address.address);`;
            
            await connection.query(

                sqlQueryTwo, [address] 

            );
    
        await connection.commit();
    
        connection.release();

        logger.info("Completed The Deletion Of The Address")
    
        return res.sendStatus(statusCode.OK);

    } catch (error) {

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

        logger.error("Error Deleting An Address: " + error.message)

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error On Deletion Of Address" });
    
    }

}



module.exports={deleteAddress, getAddress, addAddress}