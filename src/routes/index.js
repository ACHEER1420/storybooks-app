const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureGuest, routeGuard } = require('../helpers/routeGuard');

const Story = mongoose.model('stories');

router.get('/', ensureGuest, (req, res) => {
  res.render('pages/welcome');
});

router.get('/dashboard', routeGuard, async (req, res) => {
  const stories = await Story.find({ user: req.user.id });
  res.render('pages/dashboard', {
    stories,
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

module.exports = router;
