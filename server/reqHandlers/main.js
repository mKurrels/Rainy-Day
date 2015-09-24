var Group = require('../../db/models').Group;
var User = require('../../db/models').User;
var Transaction = require('../../db/models').Transaction;
var Loan = require('../../db/models').Loan;

var DWOLLA_KEY = process.env.KEY || require('../../api').key;
var DWOLLA_SECRET = process.env.SECRET || require('../../api').secret;
var Dwolla = require('dwolla-node')(DWOLLA_KEY, DWOLLA_SECRET);

var users = require('./users');
var groups = require('./groups');
var transactions = require('./transactions');
var loans = require('./loans');



exports.deposit = function (req, res) {

  var user_id = req.user;
  var amount = req.body.amount;
  var pin = req.body.pin;
  var group_id;
  var token;

  users.changeUserBalance(user_id, amount)
    
    .then(function (user) {
      token = user.get('token');
      Dwolla.setToken(token);
      Dwolla.sandbox = true;
      Dwolla.send(pin, 'michaelKurrels@gmail.com', amount, {destinationType: 'Email', notes: 'family fund deposit!'}, function(err, data) {
        if (err) { 
          console.log('errorrrrr!', err);
          throw new Error('dwolla send didnt work!'); 
        } else {
          group_id = user.get('group_id');
          groups.changeGroupBalance(group_id, amount, amount);
          return transactions.addTransaction(user_id, amount, "DEPOSIT");
        }
      });
    })
    
    .then(function (transaction) {
      res.json({error: false, data: {transaction: transaction}});
    })
    
    .catch(function (err){
      res.status(500).json({error: true, data: {message: err.message}});
    });
};



exports.newPayment = function (req, res) {

  var user_id = req.body.user_id;
  var amount = req.body.amount;
  var loan_id;
  var group_id;

  new User({id: user_id}).fetch({withRelated: ['loan']})

  .then(function (user) {
    group_id = user.get('group_id');  
    return loans.payLoan(user.related('loan'), amount);
  })

  .then(function (pmts) {
    users.changeUserBalance(user_id, pmts.toPrinciple);
    groups.payGroup(group_id, pmts);
    return transactions.addTransaction(user_id, amount, "PAYMENT");
  })

  .then(function (transaction) {
    res.json({error: false, data: {transaction: transaction}});
  })

  .catch(function (err){
    res.status(500).json({error: true, data: {message: err.message}});
  });
};



exports.newLoan = function (req, res) {

  var user_id = req.user;
  var pin = req.body.pin;
  var principle = req.body.principle;
  var duration = req.body.duration;

  new User({id: user_id}).fetch()
 
  .then(function (user) {
    userBalance = user.get('balance');
    group_id = user.get('group_id'); 
    return groups.getGroupBalancesByUserID(user_id);
  })

  .then(function (balances) {
    if (balances.available_balance > principle) {
      groups.changeGroupBalance(group_id, principle*-1, 0);
      users.changeUserBalance(user_id, principle*-1);
      transactions.addTransaction(user_id, principle*-1, "LOAN");
      return loans.addLoan(user_id, principle, duration);
    } else {
      throw new Error('Not Enough Funds!'); 
    }
  })

  .then(function (loan) {
    res.json({error: false, data: {loan: loan}});
  })

  .catch(function (err){
    res.status(500).json({error: true, data: {message: err.message}});
  });
};



exports.withdraw = function (req, res) {

  var user_id = req.user;
  var amount = req.body.amount;
  var pin = req.body.pin;
  var group_id;
  var token;

  new User({id: user_id}).fetch()

    .then(function (user) {
      userBalance = user.get('balance');
      group_id = user.get('group_id'); 
      return groups.getGroupBalancesByUserID(user_id);
    })

    .then(function (balances) {
      if (userBalance > amount && balances.available_balance > amount) {
        groups.changeGroupBalance(group_id, amount*-1, amount*-1);
        users.changeUserBalance(user_id, amount*-1);
        return transactions.addTransaction(user_id, amount*-1, "WITHDRAW");
      } else {
        throw new Error('Not Enough Funds!'); 
      }
    })

    .then(function (transaction) {
      res.json({error: false, data: {transaction: transaction}});
    })

    .catch(function (err){
      res.status(500).json({error: true, data: {message: err.message}});
    });
};

