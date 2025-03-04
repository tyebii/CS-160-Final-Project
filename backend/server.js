const express = require('express');
const app = express();
const port = process.env.PORT || 3000;  // Use a custom port or default to 3000

app.use(express.json());