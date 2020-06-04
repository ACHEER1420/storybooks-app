const express = require('express');
const router = express.Router();
const { ensureGuest, routeGuard } = require('../helpers/routeGuard');

router.get('/', ensureGuest, (req, res) => {
  res.render('pages/welcome');
});

router.get('/dashboard', routeGuard, (req, res) => {
  res.render('pages/dashboard');
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

module.exports = router;
