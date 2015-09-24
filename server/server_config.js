var express = require('express');
var passport = require('passport');
var DwollaStrategy = require('../vendor/passport-dwolla/lib/index').Strategy;
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('../db/models').User;

var api = require('./routes/router');
var authRouter = require('./routes/authRouter');

var DWOLLA_KEY = process.env.KEY || require('../api').key;
var DWOLLA_SECRET = process.env.SECRET || require('../api').secret;
var callbackURL = process.env.CALLBACK_URL || 'https://localhost:8443/auth/dwolla/callback';


passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new DwollaStrategy({
    clientID: DWOLLA_KEY,
    clientSecret: DWOLLA_SECRET,
    callbackURL: callbackURL,
    sandbox: true
  },
  function(accessToken, refreshToken, profile, done) {
    new User({id: profile._json.Response.Id})
      .fetch({withRelated: ['group', 'loan', 'transactions']})
      .then(function(user) {

        if (!user) {
          //just giving a group_id of 1 for now, while I figure out how to do groups
          return new User()
          .save({id: profile._json.Response.Id, group_id: '1', token: accessToken});
        } else {
          user.save({token: accessToken});
          return user;
        }
      })
      .then(function (user) {
        console.log('user', user);
        return done(null, profile._json.Response.Id);
      })
      .catch(function (err){
        return done(err);
      });
  }
));

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({ secret: DWOLLA_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../client'));
app.use('/api', api);
app.use('/auth', authRouter);


module.exports = app;





