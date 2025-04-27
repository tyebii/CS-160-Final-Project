const mysql = require('mysql2') //NPM install mysql12

//Need to put these into env variables
const pool = mysql.createPool({
    host: 'mysql-db',   // Use 'localhost' 
    user: 'root', // Your MySQL username 
    password: 'password', // Your MySQL password
    database: 'OFS', // Your database name
    port: 3306, // SQL Port
    timezone: 'America/Los_Angeles',
  });
  
  // Check the connection and handle errors
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
    connection.release(); 
  });

  module.exports = pool