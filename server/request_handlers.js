// var Pot = require('../db/models').Pot;
var User = require('../db/models').User;
var Transaction = require('../db/models').Transaction;
var Loan = require('../db/models').Loan;

var postX = function (req, res, model) {
  x = req.body;
  console.log('x', x);
  model.forge(x).save()
    .then(function (x) {
      res.json({id: x.get('venmoID'), x: x});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    }); 
};

var getAllX = function (req, res, Model) {
  new Model().fetchAll()
    .then(function(x) {
      res.send({data: x.models});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
};

exports.getAllUsers = function (req, res) {
  getAllX(req, res, User);
};

exports.getUserByID = function (req, res) {
  console.log(req.params.id, 'req.params.id');
  User.forge({id: req.params.id})
    .fetch({withRelated: ['transactions']})
    .then(function (user) {
      console.log("=================>", user);
      if (!user) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: user});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
};

exports.postUser = function (req, res) {
  console.log('user', req.body);
  user = req.body;
  var newUser = new User (user);
  newUser.save()
    .then(function(user) {
      console.log("we did it!!!!!!!", {user: user});
      res.json({id: user.id});
    })
    .catch(function(err){
      res.status(500).send(err);
    });
};

// exports.getAllPots = function (req, res) {
//   console.log('get pots');
//   getAllX(req, res, Pot);
// };

// exports.postPot = function (req, res) {
//   console.log('post pots', req.body);
//   postX(req, res, Pot);
// };

exports.getAllTransactions = function (req, res) {
  console.log('get Transactions');
  getAllX(req, res, Transaction);
};

exports.postTransaction = function (req, res) {
  var user_id = req.body.user_id;
  var value = req.body.value;

  var newTransaction = new Transaction ({'value': value, 'user_id': user_id});
  newTransaction.save()
    .then(function(transaction) {
      console.log("we did it!!!!!!!", {transaction: transaction});
      res.json({id: transaction.id});
    })
    .catch(function(err){
      res.status(500).send(err);
    });

};

exports.newLoan = function (req, res) {
  var user_id = req.body.user_id;
  var principle = req.body.principle;
  var duration = req.body.duration;

  var newLoan = new Loan ({'principle': principle, 'user_id': user_id, 'duration': duration});
  var newTransaction = new Transaction ({'value': principle * -1, 'user_id': user_id});
  newLoan.save()
    .then(function(loan) {
      return newTransaction.save()
        .then(function(transaction) {
          console.log("added a transaction!!!!!!!", {transaction: transaction});
          return loan;
        })
        .catch(function(err){
          res.status(500).send(err);
        });
    })
    .then(function(loan) {
      console.log("we did it!!!!!!!", {loan: loan});
      res.json({loan: loan});
    })
    .catch(function(err){
      res.status(500).send(err);
    });

    
};

//********* TODO:
// exports.getPotByUserId = function (req, res) {
//   console.log(req.params);
// };

// exports.getAllUsersByPot = function (req, res) {

// };


