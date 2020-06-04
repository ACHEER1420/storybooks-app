const express = require('express');
const router = express.Router();
const { routeGuard } = require('../helpers/routeGuard');
const mongoose = require('mongoose');

const Story = mongoose.model('stories');

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

// Handle add Story
router.post('/add', routeGuard, (req, res) => {
  const allowComments = !!req.body.allowComments;
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id,
  };
  new Story(newStory).save().then((story) => {
    res.redirect(`/stories/show/${story._id}`);
  });
});

module.exports = router;
