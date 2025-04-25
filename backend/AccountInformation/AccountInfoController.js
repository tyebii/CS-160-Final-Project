const pool = require('../Database Pool/DBConnections')

const {validateID, statusCode, validateName, validatePhoneNumber} = require('../Utils/Formatting')

const {logger} = require('../Utils/Logger')

//Gets The Customer's Information
const getCustomer = async (req, res) => {

    const customerID = req.user?.CustomerID;

    logger.info(`Fetching the customer's information with ID: ${customerID}`);

    if (!req.user || !customerID) {

        logger.warn("Unauthorized request - Missing user context");

        return res.status(statusCode.UNAUTHORIZED).json({ error: "Unauthorized" });

    }

    if (!validateID(customerID)) {

        logger.error(`Invalid format for customer ID: ${customerID}`);

        return res.status(statusCode.BAD_REQUEST).json({ error: "CustomerID has invalid format" });

    }

    const sqlQuery = `

        SELECT UserID, UserNameFirst, UserNameLast, UserPhoneNumber, c.CustomerID, c.JoinDate

        FROM customer c

        INNER JOIN users u ON c.CustomerID = u.CustomerID

        WHERE c.CustomerID = ?

    `;

    try {

        const [results] = await pool.promise().query(sqlQuery, [customerID]);

        if (results.length === 0) {

            logger.error("Customer was not found");

            return res.status(statusCode.NOT_FOUND).json({ error: "Customer not found" });

        }

        logger.info(`Information for customer ${customerID} has been fetched`);

        return res.status(statusCode.OK).json(results);

    } catch (error) {

        logger.error(`Error accessing customer info for ID ${customerID}: ${error.message}`);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Fetching Customer Information" });

    }

};

//Gets The Employees Information
const getEmployee = async (req, res) => {

    const employeeID = req.user?.EmployeeID;

    logger.info(`Fetching the employee's information with ID: ${employeeID}`);

    if (!req.user || !employeeID) {

        logger.warn("Unauthorized request - Missing user context");

        return res.status(statusCode.UNAUTHORIZED).json({ error: "Unauthorized" });

    }

    if (!validateID(employeeID)) {

        logger.error(`Invalid format for employee ID: ${employeeID}`);

        return res.status(statusCode.BAD_REQUEST).json({ error: "EmployeeID is invalid" });

    }

    const sqlQuery = `

        SELECT *

        FROM employee e

        INNER JOIN users u ON e.EmployeeID = u.EmployeeID

        WHERE e.EmployeeID = ?

    `;

    try {

        const [results] = await pool.promise().query(sqlQuery, [employeeID]);

        if (results.length === 0) {

            logger.error("Employee was not found");

            return res.status(statusCode.NOT_FOUND).json({ error: "Employee not found" });

        }

        logger.info(`Information for employee ${employeeID} has been fetched`);
        
        return res.status(statusCode.OK).json(results);

    } catch (error) {

        logger.error(`Error accessing employee info for ID ${employeeID}: ${error.message}`);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error Fetching Employee Information" });

    }

};

// Deletes Customer From The Database
const deleteCustomer = async (req, res) => {

    const customerID = req.user?.CustomerID;

    if (!req.user || !customerID) {

        logger.warn("Unauthorized request - Missing user context");

        return res.status(statusCode.UNAUTHORIZED).json({ error: "Unauthorized" });

    }

    if (!validateID(customerID)) {

        logger.error("Bad format on CustomerID");

        return res.status(statusCode.BAD_REQUEST).json({ error: "CustomerID has improper format" });

    }

    logger.info(`Starting deletion process for Customer ${customerID}`);
    
    let connection;

    try {

        connection = await pool.promise().getConnection();

        await connection.beginTransaction();

        logger.info(`Checking for ongoing transactions for Customer ${customerID}`);

        const [transactions] = await connection.query(

            "SELECT * FROM Transactions WHERE CustomerID = ? AND TransactionStatus != 'Fulfilled'",

            [customerID]

        );

        if (transactions.length !== 0) {

            logger.warn(`Customer ${customerID} has active transactions. Aborting deletion.`);

            await connection.rollback();

            return res.status(statusCode.RESOURCE_CONFLICT).json({

                error: "Cannot delete account with ongoing transactions",

            });

        }

        logger.info(`Fetching addresses for Customer ${customerID}`);

        const [addrs] = await connection.query(

            "SELECT Address FROM CustomerAddress WHERE CustomerID = ? FOR UPDATE",

            [customerID]

        );

        logger.info(`Deleting customer record (with cascading) for Customer ${customerID}`);

        await connection.query(

            "DELETE FROM Customer WHERE CustomerID = ?",

            [customerID]

        );

        logger.info("Checking and cleaning up unused addresses");

        for (const { Address: address } of addrs) {

            await connection.query(`

                DELETE FROM Address 

                WHERE Address = ? 

                  AND NOT EXISTS (SELECT 1 FROM CustomerAddress WHERE Address = ?)

                  AND NOT EXISTS (SELECT 1 FROM Transactions WHERE TransactionAddress = ?)

              `, [address, address, address]);

        }

        await connection.commit();

        logger.info(`Successfully deleted Customer ${customerID}`);

        return res.sendStatus(statusCode.OK);

    } catch (error) {

        logger.error(`Error deleting Customer ${customerID}: ${error.message}`);

        if (connection) {

            try {

                logger.info("Rolling back transaction");

                await connection.rollback();

            } catch (rollbackError) {

                logger.error("Rollback failed: " + rollbackError.message);

            }

        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({

            error: "Internal server error deleting customer",

        });

    } finally {

        if (connection) {

            try {

                logger.info("Releasing database connection");

                connection.release();

            } catch (releaseError) {

                logger.error("Failed to release connection: " + releaseError.message);

            }

        }

    }

};

//Updates Customer Data :: Not Implemented In Front End
const updateCustomer = async (req, res) => {

    const userID = req.user?.UserID;

    if (!req.user || !userID) {

        logger.warn("Unauthorized update attempt - Missing user context");

        return res.status(statusCode.UNAUTHORIZED).json({ error: "Unauthorized" });

    }

    const { FirstName, LastName, PhoneNumber } = req.body;

    if (!validateID(userID)) {

        logger.error("Bad format on UserID");

        return res.status(statusCode.BAD_REQUEST).json({ error: "UserID has improper format" });

    }

    if (!validateName(FirstName)) {

        logger.error("First name format invalid");

        return res.status(statusCode.BAD_REQUEST).json({ error: "First name format invalid" });

    }

    if (!validateName(LastName)) {

        logger.error("Last name format invalid");

        return res.status(statusCode.BAD_REQUEST).json({ error: "Last name format invalid" });

    }

    if (!validatePhoneNumber(PhoneNumber)) {

        logger.error("Phone number format invalid");

        return res.status(statusCode.BAD_REQUEST).json({ error: "Phone number format invalid" });

    }

    logger.info(`Starting update for user ${userID}`);

    try {

        await pool.promise().query(

            "UPDATE Users SET UserNameFirst = ?, UserNameLast = ?, UserPhoneNumber = ? WHERE UserID = ?",

            [FirstName, LastName, PhoneNumber, userID]

        );

        logger.info(`Successfully updated user ${userID}`);

        return res.status(statusCode.OK).json({ success: true, message: "Customer information updated" });

    } catch (error) {

        logger.error(`Error updating user ${userID}: ${error.message}`);

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error updating customer information" });

    }

};

module.exports = {getCustomer, getEmployee, deleteCustomer, updateCustomer}