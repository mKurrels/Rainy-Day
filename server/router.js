var express = require('express');
var router = express.Router();
var reqHandlers = require('./request_handlers');

var passport = require('passport');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
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

// router.get('/auth/dwolla',
//   passport.authenticate('dwolla', { scope: 'AccountInfoFull' }),

//   //what's this part for:?
//   function(req, res){
//     // The request will be redirected to Dwolla for authentication, so this
//     // function will not be called.
//   }
// );

//not sure if this will work:
// router.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

router.post('/deposit', reqHandlers.deposit);
router.post('/withdraw', reqHandlers.withdraw);
router.post('/payment', reqHandlers.newPayment);

router.route('/transactions')
  // .post(reqHandlers.postTransaction)
  .get(reqHandlers.getAllTransactions);


var redirect_uri = "https://localhost:8443/#/payment";
router.get('/auth',
  passport.authenticate('dwolla', { scope: 'AccountInfoFull' }),
  function (req, res){
    // The request will be redirected to Dwolla for authentication, so this
    // function will not be called.
  
    console.log('oh no!!! i shouldnt be called!');
  });



module.exports = router;