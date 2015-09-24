var express = require('express');
var passport = require('passport');
var router = express.Router();

var main = require('../reqHandlers/main');
var users = require('../reqHandlers/users');
var groups = require('../reqHandlers/groups');
var loans = require('../reqHandlers/loans');
var transactions = require('../reqHandlers/transactions');



router.post('/deposit', ensureAuthenticated, main.deposit);
router.post('/withdraw', ensureAuthenticated, main.withdraw);
router.post('/payment', ensureAuthenticated, main.newPayment);
router.post('/loans', ensureAuthenticated, main.newLoan);
router.get('/user', ensureAuthenticated, users.sendUserInfo);


//for testing (eg through postman) only:
router.route('/users')
  .get(users.getAllUsers)
  .post(users.postUser);

router.route('/groups')
  .get(groups.getGroups)
  .post(groups.postGroup);

router.route('/loans')
  .get(loans.getLoans);

router.route('/transactions')
  .get(transactions.getAllTransactions);



function ensureAuthenticated(req, res, next) {
  console.log('req.user', req.user);
  if (req.isAuthenticated()) { 
    return next(); 
  } else {
    res.status(403).json({error: true, data: {message: "not signed in"}});
  }
}

module.exports = router;