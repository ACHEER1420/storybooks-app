require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport Config
require('./src/configs/passport')(passport);

const app = express();

// Load Routes
const authRoutes = require('./src/routes/auth');

app.get('/', (req, res) => {
  res.send('Hello, Worlds!');
});

// Use Routes
app.use('/auth', authRoutes);

const _PORT = process.env.PORT || 5000;

app.listen(_PORT, () => {
  console.log(`Application is running on port ${_PORT}`);
});
