var User = require('../../db/models').User;
var Group = require('../../db/models').Group;
var utils = require('./utils');



exports.postUser = function (req, res) {
  
  return new User(req.body).save()
    .then(function(user) {
      res.json(user);
    })
    .catch(function(err){
      res.status(500).send(err);
    });
};


exports.getAllUsers = function (req, res) {

  utils.getAllX(req, res, User);
};


exports.changeUserBalance = function (user_id, amount) {

  return new User({id: user_id}).fetch()
    .then(function(user){
      return user.save({balance: user.get('balance') + amount});
    });
};


exports.sendUserInfo = function(req, res) {

  var user_id = req.user;
  console.log('user_id', user_id);
  getUserInfo(user_id)
    .then(function (data) {
      res.send(data);
    });
};


exports.getUserInfo = getUserInfo = function(user_id) {
  
  var userBalance;
  var groupTotal;
  var groupAvailable;
  //just have one group for now
  return new User({id: user_id}).fetch()

    .then(function (user) {
      console.log('user', user);
      userBalance = user.get('balance');
      return new Group({id: '1'}).fetch();
    })

    .then(function(group) {
      console.log('group', group);
      groupTotal = group.get('balance');
      groupAvailable = group.get('available_balance');
      return ({userBalance: userBalance,
               groupTotal: groupTotal,
               groupAvailable: groupAvailable
              });
    })

    .catch(function (err){
      console.log("oops! error", err.message);
    });
};