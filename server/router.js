var express = require('express');
var router = express.Router();
var reqHandlers = require('./request_handlers');
var authHandler = require('./authHandler');
var sendUserInfo = require('./utils').sendUserInfo;
var passport = require('passport');


router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', function (req, res) {
  res.send('hello world');
});
router.route('/users')
  .get(reqHandlers.getAllUsers)
  .post(reqHandlers.postUser);

router.get('/user', ensureAuthenticated, sendUserInfo);

router.route('/groups')
  .get(reqHandlers.getGroups)
  .post(reqHandlers.postGroup);


router.route('/users/:code')
  .get(reqHandlers.getUserInfoByCode);

router.route('/loans')
  .get(reqHandlers.getLoans)
  .post(reqHandlers.newLoan);

router.get('/oauth_return', authHandler.getTokenFromCode);

router.post('/deposit', ensureAuthenticated, reqHandlers.deposit);
router.post('/withdraw', ensureAuthenticated, reqHandlers.withdraw);
router.post('/payment', reqHandlers.newPayment);

router.route('/transactions')
  .get(reqHandlers.getAllTransactions);


router.get('/auth',
  passport.authenticate('dwolla', { scope: 'AccountInfoFull' }),
  function (req, res){
    // The request will be redirected to Dwolla for authentication, so this
    // function will not be called.
  });

function ensureAuthenticated(req, res, next) {
  console.log('req.isAuthenticated()', req.isAuthenticated());
  if (req.isAuthenticated()) { 
    return next(); 
  } else {
    res.status(403).json({error: true, data: {message: "not signed in"}});
  }
}

module.exports = router;