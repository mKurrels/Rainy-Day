var Group = require('../../db/models').Group;
var User = require('../../db/models').User;
var Transaction = require('../../db/models').Transaction;
var Loan = require('../../db/models').Loan;


exports.postX = function (req, res, model) {
  
  x = req.body;
  new model().save(x)
    .then(function (y) {
      res.json({error: false, data: y});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    }); 
};

exports.getAllX = function (req, res, Model) {
  
  new Model().fetchAll()
    .then(function(x) {
      res.send({data: x.models});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
};
