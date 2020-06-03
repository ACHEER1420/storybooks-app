const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Worlds!');
});

const _PORT = process.env.PORT || 5000;

app.listen(_PORT, () => {
  console.log(`Application is running on port ${_PORT}`);
});
