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
router.route('/users')
  .get(reqHandlers.getAllUsers)
  .post(reqHandlers.postUser);


router.route('/users/:id')
  .get(reqHandlers.getUserInfoByID);

router.route('/loans')
  // .get(reqHandlers.getAllUsers)
  .post(reqHandlers.newLoan);

  
// router.route('/pots')
//   .post(reqHandlers.postPot)
//   .get(reqHandlers.getAllPots);

router.route('/transactions')
  .post(reqHandlers.postTransaction)
  .get(reqHandlers.getAllTransactions);

router.get('/auth', function (req, res) {
  res.redirect('https://sandbox-api.venmo.com/v1/oauth/authorize?client_id=2887&scope=access_profile');
});

//TODO:
// router.route('/pots/:user_id')
//   .get(reqHandlers.getPotByUserId);


module.exports = router;