const express = require('express');
const router = express.Router();
const { routeGuard } = require('../helpers/routeGuard');

// Stories Page
router.get('/', (req, res) => {
  res.render('stories/index');
});

// Add Story Form
router.get('/add', routeGuard, (req, res) => {
  res.render('stories/add');
});

router.get('/edit/:id', routeGuard, (req, res) => {
  res.render('stories/edit');
});

module.exports = router;
