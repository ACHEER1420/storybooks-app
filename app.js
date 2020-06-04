require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// Load User Model
require('./src/models/User');

// Passport Config
require('./src/configs/passport')(passport);

mongoose
  .connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error));

const app = express();

// Load Routes
const authRoutes = require('./src/routes/auth');

app.get('/', (req, res) => {
  res.send('Hello, Worlds!');
});

//
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middelware
app.use(passport.initialize());
app.use(passport.session());

// Set global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use('/auth', authRoutes);

const _PORT = process.env.PORT || 5000;

app.listen(_PORT, () => {
  console.log(`Application is running on port ${_PORT}`);
});
