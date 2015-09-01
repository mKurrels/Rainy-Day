var User = require('../db/models').User;
var Pot = require('../db/models').Pot;
var Payment = require('../db/models').Payment;

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
  postX(req, res, User);
};

exports.getAllPots = function (req, res) {
  console.log('get pots');
  getAllX(req, res, Pot);
};

exports.postPot = function (req, res) {
  console.log('post pots', req.body);
  postX(req, res, Pot);
};

exports.getAllPayments = function (req, res) {
  console.log('get payments');
  getAllX(req, res, Payment);
};

exports.postPayment = function (req, res) {
  var user_id = JSON.parse(req.body.user_id);
  var value = JSON.parse(req.body.value);

  var newPayment = new Payment ({'value': value, 'user_id': user_id});
  newPayment.save()
    .then(function(payment) {
      console.log("we did it!!!!!!!", {payment: payment});
      res.json({id: payment.id});
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


