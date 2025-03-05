const express = require('express');
const cors = require('cors');  //NPM Install Cors
const mysql = require('mysql2') //NPM install mysql12
const app = express();
const PORT = 3301;

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

// Enable CORS for requests from localhost:3300 only
app.use(cors({
  origin: 'http://localhost:3300',  
  methods: 'GET,POST,DELETE,PUT',  
  allowedHeaders: 'Content-Type', 
}));

// Test API Endpoint
app.get('/api/greet', async (req, res) => {
  const [rows, fields] = await pool.promise().query('Select * From Address')
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
