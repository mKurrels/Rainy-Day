
var Group = require('../../db/models').Group;
var User = require('../../db/models').User;
var utils = require('./utils');
var users = require('./users');


exports.postGroup = function (req, res) {
  
  utils.postX(req, res, Group);
};


exports.getGroups = function (req, res) {
  
  utils.getAllX(req, res, Group);
};


exports.changeGroupBalance = changeGroupBalance = function(group_id, changeAvailable, changeTotal) {
  
  return new Group({id: group_id}).fetch()
    .then(function(group){
      return group.save({
        available_balance: group.get('available_balance')*1 + changeAvailable*1,
        balance: group.get('balance')*1 + changeTotal*1
      });
    });
};


exports.getGroupBalancesByUserID = function (user_id) {

  return new User({id: user_id}).fetch({withRelated: ['group']})
    .then(function (user) {
      var available_balance = user.related('group').get('available_balance');
      var balance = user.related('group').get('available_balance');
      return {
        available_balance: available_balance,
        balance: balance
      };
    });
};


//there will be rounding errors which will make the members add up to more
//or less than the group balance. How should I fix this?
exports.payGroup = function (group_id, pmt) {

  var toInterest = pmt.toInterest;
  var toPrinciple = pmt.toPrinciple;
  var addToGroupBalance = 0;
  var total = 0;

  return new Group({id: group_id}).fetch({withRelated: ['users']})
    
    .then(function (group) {
      var members = (group.related('users'));
      
      members.each(function(member) {
        var memberBalance = member.get('balance');
        if (memberBalance && memberBalance > 0) {
          total += memberBalance;
        }
      });
      
      members.each(function(member) {
        var memberBalance = member.get('balance');
        if (memberBalance && memberBalance > 0) {
          var toAdd = (memberBalance / total) * toInterest;
          users.changeUserBalance(member.get('id'), toAdd);
          addToGroupBalance += toAdd;
        }
      });

      return changeGroupBalance(group_id, toInterest + toPrinciple + addToGroupBalance, addToGroupBalance);
    });
};