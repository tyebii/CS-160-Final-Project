const { error, add } = require('winston')
const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger')

//Gets The Customer's Information
const getCustomer = (req, res) => {

    const customerID = req.user?.CustomerID

    logger.info("Fetching The Customer's Information With ID: " + customerID)

    if(!validateID(customerID)){

        logger.error("The Format For Fetching Customer With ID " + customerID + " Information Is Invalid")
        
        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Has Invalid Format"})

    }

    logger.info("Now Getting Customer Information For " + customerID + " From The Database")

    const sqlQuery = "SELECT UserID, UserNameFirst, UserNameLast, UserPhoneNumber, c.CustomerID, c.JoinDate FROM customer c INNER JOIN users u ON c.CustomerID = u.CustomerID WHERE c.CustomerID = ?"

    pool.query(sqlQuery, [customerID], (error, results)=>{

        if(error){

            logger.error("Error Accessing Customer Information For Customer " + customerID + " :" + error.message)

            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error Fetching Customer Information"})

        }

        logger.info("Information For Customer " + customerID + " Has Been Fetched")

        return res.status(statusCode.OK).json(results)

    })
    
}

//Gets The Employees Information
const getEmployee = (req, res) => {

    const employeeID = req.user?.EmployeeID

    logger.info("Fetching The Employee's Information With Employee ID: " + employeeID)

    if(!validateID(employeeID)){

        logger.error("The Format For Fetching Employee With ID " + employeeID + " Information Is Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Employee ID Is Invalid"})

    }

    logger.info("Getting Customer Information For " + employeeID)

    const sqlQuery = "SELECT * FROM employee e INNER JOIN users u ON e.EmployeeID = u.EmployeeID WHERE e.EmployeeID = ?"

    pool.query(sqlQuery, [employeeID], (error, results)=>{

        if(error){

            logger.error("Error Accessing Employee Information For ID " + employeeID + " : " + error.message)

            return res.status(statusCode.SERVICE_UNAVAILABLE).json({error: "Internal Server Error Fetching Employee Information"})

        }

        logger.info("Information For Employee " + employeeID + " Has Been Fetched")

        return res.status(statusCode.OK).json(results)

    })

}

//Deletes User From The Database
const deleteCustomer = async (req, res) => {

    const customerID = req.user?.CustomerID;

    if(!validateID(customerID)){

        logger.error("Bad Format On CustomerID")

        return res.status(statusCode.BAD_REQUEST).json({error:"CustomerID Has Improper Format"})

    }

    logger.info("Deleting Customer For Customer " + customerID);

    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

        logger.info("Checking For Ongoing Transactions");

        const [transactions] = await connection.query(

            "SELECT * FROM Transactions WHERE CustomerID = ? AND TransactionStatus != 'Fulfilled'",

            [customerID]

        );

        if (transactions.length !== 0) {

            logger.error("Ongoing Transaction Occurring. Aborting Deletion");

            throw new Error("Cannot Delete Account With Ongoing Transactions");

        }

        logger.info("Get The Addresses Associated With Customer");

        const [addrs] = await connection.query(

            "SELECT Address FROM CustomerAddress WHERE CustomerID = ?",

            [customerID]

        );

        logger.info("Deleting From Customer Table (Cascade Handles User Deletion)");

        await connection.query(

            "DELETE FROM Customer WHERE CustomerID = ?",

            [customerID]

        );

        logger.info("Deleting Addresses With No Association");

        for (const addrObj of addrs) {

            const address = addrObj.Address;

            const [exists] = await connection.query(

                "SELECT * FROM CustomerAddress WHERE Address = ?",

                [address]

            );

            if (exists.length === 0) {

                await connection.query(

                    "DELETE FROM Address WHERE Address = ?",

                    [address]

                );

            }

        }

        await connection.commit();

        connection.release();

        logger.info("Successful Account Deletion");

        return res.sendStatus(statusCode.OK);

    } catch (error) {

        logger.error("Error Deleting Customer: " + error.message);

        if (connection) {

            try {

                logger.info("Rolling Back Transaction");

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

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:error.message});

    }

};

//Updates The Customer User Information
const updateCustomer = () => {

    logger.info("Updating The Customer Account Information")

    const userID = req.user?.UserID;
    
    const {FirstName, LastName, PhoneNumber} = req.body

    if(!validateID(userID)){

        logger.error("Bad Format On UserID")

        return res.status(statusCode.BAD_REQUEST).json({error:"UserID Has Improper Format"})

    }

    if(!validateName(FirstName)){

        logger.error("First Name Format Invalid")
    
        return res.status(statusCode.BAD_REQUEST).json({error:"First Name Format Invalid"})
    
    }
    
    if(!validateName(LastName)){

        logger.error("Last Name Format Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Last Name Format Invalid"})

    }

    if (!validatePhoneNumber(PhoneNumber)) {

        logger.error("Phone Number Format Invalid")

        return res.status(statusCode.BAD_REQUEST).json({error:"Phone Number Format Invalid"})

    }

    logger.info("Updating The User's Information For User " + userID)

    pool.query("Update Users Set UserNameFirst = ?, UserNameLast = ?, UserPhoneNumber = ? Where UserID = ?", [FirstName,LastName,PhoneNumber,userID], (error)=>{

        if(error){

            logger.error("Error Accessing Updating User Information For ID " + userID + " : " + error.message)

            return res.status(statusCode.SERVICE_UNAVAILABLE).json({error: "Internal Server Error updating Customer Information"})

        }

        logger.info("Information For Customer " + userID + " Has Been Updated")

        return res.status(statusCode.OK)

    })

}


module.exports = {getCustomer, getEmployee, deleteCustomer, updateCustomer}