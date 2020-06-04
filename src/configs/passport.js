require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');

// Load User Model
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);

        const image = profile.photos[0].value;
        // console.log(image);

        const newUSer = {
          googleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image,
        };

        // check for existing user
        User.findOne({
          googleID: profile.id,
        })
          .then((user) => {
            if (user) {
              // Return user
              done(null, user);
            } else {
              // Create user
              new User(newUSer).save().then((user) => done(null, user));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
