var Group = require('../db/models').Group;
var User = require('../db/models').User;
var Transaction = require('../db/models').Transaction;
var Loan = require('../db/models').Loan;
var DWOLLA_KEY = process.env.KEY || require(__dirname + '/../api').key;
var DWOLLA_SECRET = process.env.SECRET || require(__dirname + '/../api').secret;
var Dwolla = require('dwolla-node')(DWOLLA_KEY, DWOLLA_SECRET);
Dwolla.sandbox = true;


exports.getTokenFromCode = function(req, res) {
  var code = req.query.code;

  Dwolla.finishAuth(code, 'https://localhost:8443/#/payment', function(error, auth) {
    var output = "Your OAuth access_token is: <b>" + auth.access_token + "</b>, which will expire in " + auth.expires_in + " seconds.<br>Your refresh_token is: <b>" + auth.refresh_token + "</b>, and that'll expire in " + auth.refresh_expires_in + " seconds.";
    output += '<br><a href="/refresh?refreshToken=' + encodeURIComponent(auth.refresh_token) + '">Click here to get a new access and refresh token pair!</a>';
    console.log(13, 'output', auth, access_token);
    if (error) {
      res.status(500).json({error: true, data: {message: error}});
    } else {
      return res.cookie(auth.access_token, DWOLLA_SECRET, { signed: true, secure: true });
      // return res.send({data: auth.access_token});  
    }
  });


};


// exports.auth = function(req, res, next){ 
//   if (!req.isAuthenticated()) {
//     res.send(401); 
//   } else {
//     next(); 
//   }
// };





