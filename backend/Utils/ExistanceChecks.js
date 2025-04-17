const pool = require('../Database Pool/DBConnections');

//Check Customer Existance
async function customerIDExists(CustomerID){

    return new Promise((resolve,reject)=>{

        pool.query('Select * From users Where CustomerID = ?', [CustomerID], (error, results) => {

            if (error) {

                reject(error)

            }else{

                resolve(results.length !== 0)

            }

        });

    })

}

//Check Employee Existance
async function employeeIDExists(EmployeeID){

    return new Promise((resolve,reject)=>{

        pool.query('Select * From users Where EmployeeID = ?', [EmployeeID], (error, results) => {

            if (error) {

                reject(error)

            }else{

                resolve(results.length!==0)

            }
            
        });

    })

}

//Supervisor Existance Check
async function supervisorExists(SupervisorID) {

    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM employee WHERE EmployeeID = ? and SupervisorID is null', [SupervisorID], (error, results) => {

            if (error) {

                reject(error);

            } else {

                resolve(results.length > 0);

            }

        });

    });

}

//TransactionID Existance Check
async function transactionIDExists(transactionID) {

    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM Transactions WHERE TransactionID = ?', [transactionID], (err, results) => {

            if (err) {

                reject(err); 

            } else {

                resolve(results.length > 0); 
                
            }

        });

    });

}

//ItemID Existance Check
async function itemIDExists(itemID) {

    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM Inventory WHERE ItemID = ?', [itemID], (err, results) => {

            if (err) {

                reject(err); 

            } else {

                resolve(results.length > 0); 
                
            }

        });

    });

}

module.exports = {customerIDExists, employeeIDExists, supervisorExists, transactionIDExists, itemIDExists}