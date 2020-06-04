const express = require('express');
const router = express.Router();
const { routeGuard } = require('../helpers/routeGuard');
const mongoose = require('mongoose');

const Story = mongoose.model('stories');

// Stories Page
router.get('/', async (req, res) => {
  const stories = await Story.find({}).populate('user');
  res.render('stories/index', {
    stories,
  });
});

// Add Story Form Page
router.get('/add', routeGuard, (req, res) => {
  res.render('stories/add');
});

// Show single story page
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id,
  })
    .populate('user')
    .then((story) => {
      res.render('stories/show', {
        story,
      });
    });
});

// Edit Story Form Page
router.get('/edit/:id', routeGuard, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id });
  res.render('stories/edit', {
    story,
  });
});

// Handle Add Story
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

// Handle Edit Story

module.exports = router;
