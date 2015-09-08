  var express = require('express');
var router = express.Router();
var reqHandlers = require('./request_handlers');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.route('/users')
  .get(reqHandlers.getAllUsers)
  .post(reqHandlers.postUser);

router.route('/groups')
  .get(reqHandlers.getGroups)
  .post(reqHandlers.postGroup);


router.route('/users/:id')
  .get(reqHandlers.getUserInfoByID);

router.route('/loans')
  .get(reqHandlers.getLoans)
  .post(reqHandlers.newLoan);

router.post('/deposit', reqHandlers.deposit);
router.post('/withdraw', reqHandlers.withdraw);
router.post('/payment', reqHandlers.newPayment);

router.route('/transactions')
  // .post(reqHandlers.postTransaction)
  .get(reqHandlers.getAllTransactions);

router.get('/auth', function (req, res) {
  res.redirect('https://sandbox-api.venmo.com/v1/oauth/authorize?client_id=2887&scope=access_profile');
});



module.exports = router;