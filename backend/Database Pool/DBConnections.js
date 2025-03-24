const mysql = require('mysql2') //NPM install mysql2

const pool = mysql.createPool({
    host: 'localhost',   // Use 'localhost' 
    user: 'root', // Your MySQL username 
    password: 'password', // Your MySQL password
    database: 'OFS', // Your database name
    port: 3306, // SQL Port
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