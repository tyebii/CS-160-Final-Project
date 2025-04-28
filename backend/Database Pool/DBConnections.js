const mysql = require('mysql2') 


const pool = mysql.createPool({

    host: 'mysql-db',   

    user: 'root', 

    password: 'password', 

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