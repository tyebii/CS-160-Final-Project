const mysql = require('mysql2') 


const pool = mysql.createPool({

    host: 'localhost',   

    user: 'root', 

    password: 'MP5wL+r+L', 

    database: 'OFS', 

    port: 3306, 

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