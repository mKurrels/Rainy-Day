var User = require('../db/models').User;
// var Pot = require('../db/models').Pot;
var Transaction = require('../db/models').Transaction;

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
  var user_id = JSON.parse(req.body.user_id);
  var value = JSON.parse(req.body.value);

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


//********* TODO:
// exports.getPotByUserId = function (req, res) {
//   console.log(req.params);
// };

// exports.getAllUsersByPot = function (req, res) {

// };


