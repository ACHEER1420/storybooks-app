const express = require('express');
const router = express.Router();
const { routeGuard } = require('../helpers/routeGuard');
const mongoose = require('mongoose');

const Story = mongoose.model('stories');

// Stories Page
router.get('/', async (req, res) => {
  const stories = await Story.find({}).populate('user').sort({ date: 'desc' });
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
    .populate('comments.commentUser')
    .then((story) => {
      switch(true){
        case !req.user:
          res.redirect('/stories');
          break;
        case (story.user.id !== req.user.id):
          res.redirect('/stories');
          break;
        default:
          res.render('stories/show', {
            story,
          });
      }
    });
});

// List all public stories from one user page
router.get('/user/:id', async (req, res) => {
  const stories = await Story.find({
    user: req.params.id,
    status: 'public',
  }).populate('user');
  if (stories) {
    res.render('stories/index', {
      stories,
    });
  }
});

// List stories of current User page
router.get('/my-stories', routeGuard, async (req, res) => {
  const stories = await Story.find({
    user: req.user.id,
  }).populate('user');
  if (stories) {
    res.render('stories/index', {
      stories,
    });
  }
});

// Edit Story Form Page
router.get('/edit/:id', routeGuard, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id, user: req.user._id });
  if (!story) {
    res.redirect('/stories');
  } else {
    res.render('stories/edit', {
      story,
    });
  }
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
router.put('/:id', async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  });

  const allowComments = !!req.body.allowComments;
  story.title = req.body.title;
  story.body = req.body.body;
  story.status = req.body.status;
  story.allowComments = allowComments;

  story.save().then(() => {
    res.redirect('/dashboard');
  });
});

// Handle Delete Story
router.delete('/:id', async (req, res) => {
  const response = await Story.deleteOne({ _id: req.params.id });
  if (response) res.redirect('/dashboard');
});

// Handle Add comment
router.post('/comment/:id', async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  });
  if (story) {
    const newComment = {
      commentsBody: req.body.commentsBody,
      commentUser: req.user._id,
    };
    // Add to comments array
    story.comments.unshift(newComment);
    story.save().then((story) => {
      res.redirect(`/stories/show/${story._id}`);
    });
  }
});

module.exports = router;
