const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log(req.user);
  res.render('home/welcome');
});

router.get('/dashboard', (req, res) => {
  res.send('Dashboard');
});

module.exports = router;
