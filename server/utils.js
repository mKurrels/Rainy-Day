var Group = require('../db/models').Group;
var User = require('../db/models').User;
var Transaction = require('../db/models').Transaction;
var Loan = require('../db/models').Loan;

// exports.sendUserInfo = function(req, res, shouldRedirect) {
//   console.log('req.user', req.user, 'req.id', req.id, 'shouldRedirect', shouldRedirect);
//   var user_id = req.user;
//   getUserInfo(user_id)
//     .then(function (data) {
//       var queryString = '?userBalance=' + data.userBalance +
//                         '&groupTotal=' + data.groupTotal +
//                         '&groupAvailable=' + data.groupAvailable;
//       res.redirect('/#/payment' + queryString);
//     });
// };

exports.sendUserInfo = function(req, res) {
  console.log('req.user', req.user, 'req.id', req.id);
  var user_id = req.user;
  getUserInfo(user_id)
    .then(function (data) {
      res.send(data);
    });
};

function getUserInfo(user_id) {
  var userBalance;
  var groupTotal;
  var groupAvailable;
  
  //just have one group for now
  return new User({id: user_id}).fetch()
    .then(function (user) {
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
}




