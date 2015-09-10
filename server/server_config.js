var express = require('express');
var morgan = require('morgan');
var api = require('./router');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var fs = require('fs');
var passport = require('passport');
var DwollaStrategy = require('passport-dwolla').Strategy;
var DWOLLA_KEY = require('../api').key;
var DWOLLA_SECRET = require('../api').secret;
// var dwolla = require('dwolla');
// dwolla.sandbox = true;


/// I'll have to change this. Want to serialize and deserialize
/// user's dwolla id;
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new DwollaStrategy({
    clientID: DWOLLA_KEY,
    authorizationURL: 'https://uat.dwolla.com/oauth/v2/authenticate',
    clientSecret: DWOLLA_SECRET,
    callbackURL: "https://localhost:8443/#/payment"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Dwolla profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Dwolla account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use('/api', api);
// will have to use this later app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


module.exports = app;