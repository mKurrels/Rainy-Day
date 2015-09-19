var Group = require('../db/models').Group;
var User = require('../db/models').User;
var Transaction = require('../db/models').Transaction;
var Loan = require('../db/models').Loan;

var express = require('express');
var router = express.Router();

var DWOLLA_KEY = process.env.KEY || require(__dirname + '/../api').key;
var DWOLLA_SECRET = process.env.SECRET || require(__dirname + '/../api').secret;
var Dwolla = require('dwolla-node')(DWOLLA_KEY, DWOLLA_SECRET);
var passport = require('passport');
var sendUserInfo = require('./utils').sendUserInfo;



router.get('/dwolla',
  passport.authenticate('dwolla', { scope: 'AccountInfoFull' }),
  function(req, res){
    // The request will be redirected to Dwolla for authentication, so this
    // function will not be called.
  });



router.get('/dwolla/callback', 
  passport.authenticate('dwolla', { failureRedirect: '/#/auth' }),
  function (req, res) {
    res.redirect('/#/payment');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/#/auth');
});
  // function (req, res) {
  //   var code = req.query.code;
  //   Dwolla.finishAuth(code, 'https://localhost:8443/auth/oauth_return3', function(error, auth) {
      
  //     console.log(13, 'output', auth, 'auth.account_id', auth.account_id);
  //     if (error) {
  //       res.status(500).json({error: true, data: {message: error}});
  //     } else {
  //       getUserInfo(auth.account_id)
  //         .then(function (data) {
            // res.cookie('userBalance', data.userBalance);
            // res.cookie('groupTotal', data.groupTotal);
            // res.cookie('groupAvailable', data.groupAvailable);
            // res.redirect('https://localhost:8443/auth/oauth_return3');
  //         });
  //     }
  //   });
  // }
// );





module.exports = router;