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

app.get('/api/greet', async (req, res) => {
    try {
        res.json({ message: 'Hello from the server!' });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/search/:searchType/:query', (req, res) => {
  
  let { searchType, query } = req.params;
  query = query.replace("-"," ");
  console.log(searchType);
  console.log(query);
  if (searchType == "category") {
    pool.query('SELECT * FROM inventory WHERE category = ?', [query], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  }else if (searchType == "product") {
    pool.query('SELECT * FROM inventory WHERE ProductName like ?', ["%" + query+ "%"], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  }
});



app.get('/searchItem/:itemid', (req, res) => {
  let {itemid} = req.params;
  console.log(itemid);
  pool.query('SELECT * FROM inventory WHERE ItemID = ?', [itemid], (err, results) => {
    if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    console.log(results);
    res.json(results);
    });
  }
);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {pool, app}