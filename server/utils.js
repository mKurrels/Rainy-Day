// var Group = require('../db/models').Group;
// var User = require('../db/models').User;
// var Transaction = require('../db/models').Transaction;
// var Loan = require('../db/models').Loan;


// exports.sendUserInfo = function(req, res) {

//   var user_id = req.user;
//   getUserInfo(user_id)
//     .then(function (data) {
//       res.send(data);
//     });
// };

// function getUserInfo(user_id) {
  
//   var userBalance;
//   var groupTotal;
//   var groupAvailable;
  
//   //just have one group for now
//   return new User({id: user_id}).fetch()
//     .then(function (user) {
//       userBalance = user.get('balance');
//       return new Group({id: '1'}).fetch();
//     })
//     .then(function(group) {
//       groupTotal = group.get('balance');
//       groupAvailable = group.get('available_balance');
//       return ({userBalance: userBalance,
//                groupTotal: groupTotal,
//                groupAvailable: groupAvailable
//               });
//     })
//     .catch(function (err){
//       console.log("oops! error", err.message);
//     });
// }




