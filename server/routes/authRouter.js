
var express = require('express');
var router = express.Router();

var DWOLLA_KEY = process.env.KEY || require(__dirname + '/../../api').key;
var DWOLLA_SECRET = process.env.SECRET || require(__dirname + '/../../api').secret;
var Dwolla = require('dwolla-node')(DWOLLA_KEY, DWOLLA_SECRET);
var passport = require('passport');



router.get('/dwolla',
  passport.authenticate('dwolla', { scope: 'AccountInfoFull|Send|Request' }),
  function(req, res){
    // The request will be redirected to Dwolla for authentication, so this
    // function will not be called.
  });

router.get('/dwolla/callback', 
  passport.authenticate('dwolla', { failureRedirect: '/#/auth' }),
  function (req, res) {
    res.redirect('/#/payment');
  });



module.exports = router;
