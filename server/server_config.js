var express = require('express');
var passport = require('passport');
var DwollaStrategy = require('passport-dwolla').Strategy;
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');

var api = require('./router');
var authRouter = require('./authRouter');

var DWOLLA_KEY = process.env.KEY || require('../api').key;
var DWOLLA_SECRET = process.env.SECRET || require('../api').secret;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new DwollaStrategy({
    clientID: DWOLLA_KEY,
    clientSecret: DWOLLA_SECRET,
    callbackURL: "https://localhost:8443/auth/dwolla/callback",
    sandbox: true
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log('profile', profile, 'json', JSON.stringify(profile));
      // getUserInfo


      return done(null, profile);
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





function getUserInfo(user_id) {
  var userBalance;
  var groupTotal;
  var groupAvailable;
  return new User({id: user_id}).fetch({withRelated: ['group']})
    .then(function(user) {
      if (!user) {
        //just giving a group_id of 1 for now, while I figure out how to do groups
        new User({id: user_id, group_id: '1'}).save();
        return new Group({id: '1'}).fetch()
          .then(function(group) {
            console.log('group', group);
            groupTotal = group.get('balance');
            groupAvailable = group.get('available_balance');
            return ({userBalance: 0,
                     groupTotal: groupTotal,
                     groupAvailable: groupAvailable
                    });
          });
      
      } else {
        userBalance = user.get('balance');
        groupTotal = user.related('group').get('balance');
        groupAvailable = user.relate('group').get('available_balance');
        return ({userBalance: userBalance,
                 groupTotal: groupTotal,
                 groupAvailable: groupAvailable
                });
      }
    })
    .catch(function (err){

      console.log(err.message);
    });
}