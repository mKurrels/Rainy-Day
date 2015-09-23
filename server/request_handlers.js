// var Group = require('../db/models').Group;
// var User = require('../db/models').User;
// var Transaction = require('../db/models').Transaction;
// var Loan = require('../db/models').Loan;

// var DWOLLA_KEY = process.env.KEY || require('../api').key;
// var DWOLLA_SECRET = process.env.SECRET || require('../api').secret;
// var Dwolla = require('dwolla-node')(DWOLLA_KEY, DWOLLA_SECRET);
        


/*******************************************
helpers  *************************************
********************************************/


// var postX = function (req, res, model) {
//   x = req.body;
//   new model().save(x)
//     .then(function (y) {
//       res.json({error: false, data: y});
//     })
//     .catch(function (err) {
//       res.status(500).json({error: true, data: {message: err.message}});
//     }); 
// };

// var getAllX = function (req, res, Model) {
//   new Model().fetchAll()
//     .then(function(x) {
//       res.send({data: x.models});
//     })
//     .catch(function (err) {
//       res.status(500).json({error: true, data: {message: err.message}});
//     });
// };


/*******************************************
Groups  *************************************
********************************************/

// exports.postGroup = function (req, res) {
//   postX(req, res, Group);
// };

// exports.getGroups = function (req, res) {
//   getAllX(req, res, Group);
// };


// exports.getLoans = function (req, res) {
  
//   getAllX(req, res, Loan);
// };
/*******************************************
USERS  *************************************
********************************************/

// exports.postUser = function (req, res) {
  
//   return new User(req.body).save()
//     .then(function(user) {
//       res.json(user);
//     })
//     .catch(function(err){
//       res.status(500).send(err);
//     });
// };


// var changeUserBalance = function (user_id, amount) {
//   return new User({id: user_id}).fetch()
//     .then(function(user){
//       return user.save({balance: user.get('balance') + amount});
//     });
// };

// var changeGroupBalance = function (group_id, changeAvailable, changeTotal) {
//   return new Group({id: group_id}).fetch()
//     .then(function(group){
//       return group.save({
//         available_balance: group.get('available_balance')*1 + changeAvailable*1,
//         balance: group.get('balance')*1 + changeTotal*1
//       });
//     });
// };

// var addTransaction = function (user_id, value, type) {
//   return new Transaction()
//     .save({
//       user_id: user_id,
//       value: value,
//       type: type
//     });
// };

// exports.deposit = function (req, res) {
//   var user_id = req.user;
//   var amount = req.body.amount;
//   var pin = req.body.pin;
//   var group_id;
//   var token;
//   changeUserBalance(user_id, amount)
//     .then(function (user) {
//       token = user.get('token');
//       Dwolla.setToken(token);
//       Dwolla.sandbox = true;
//       Dwolla.send(pin, 'michaelKurrels@gmail.com', amount, {destinationType: 'Email', notes: 'family fund deposit!'}, function(err, data) {
//         if (err) { 
//           throw new Error('dwolla send didnt work!'); 
//         } else {
//           group_id = user.get('group_id');
//           changeGroupBalance(group_id, amount, amount);
//           return addTransaction(user_id, amount, "DEPOSIT");
//         }
//       });
//     })
//     .then(function (transaction) {
//       res.json({error: false, data: {transaction: transaction}});
//     })
//     .catch(function (err){
//       res.status(500).json({error: true, data: {message: err.message}});
//     });
// };


// var getUserByID = function (user_id) {
//   return new User({id: user_id}).fetch()
//     .then(function (user) {
//       return user;
//     });
// };

// var getGroupBalancesByUserID = function (user_id) {
//   return new User({id: user_id}).fetch({withRelated: ['group']})
//     .then(function (user) {
//       var available_balance = user.related('group').get('available_balance');
//       var balance = user.related('group').get('available_balance');
//       return {
//         available_balance: available_balance,
//         balance: balance
//       };
//     });
// };

// exports.withdraw = function (req, res) {

//   var user_id = req.user;
//   var amount = req.body.amount;
//   var pin = req.body.pin;
//   var group_id;
//   var token;
//   new User({id: user_id}).fetch()
//     .then(function (user) {
//       userBalance = user.get('balance');
//       group_id = user.get('group_id'); 
//       return getGroupBalancesByUserID(user_id);
//     })
//     .then(function (balances) {

//       if (userBalance > amount && balances.available_balance > amount) {
//         changeGroupBalance(group_id, amount*-1, amount*-1);
//         changeUserBalance(user_id, amount*-1);
//         return addTransaction(user_id, amount*-1, "WITHDRAW");
//       } else {
//         throw new Error('Not Enough Funds!'); 
//       }

//     })
//     .then(function (transaction) {
//       res.json({error: false, data: {transaction: transaction}});
//     })
//     .catch(function (err){
//       res.status(500).json({error: true, data: {message: err.message}});
//     });
// };

// var addLoan = function (user_id, principle, duration) {
//   return new Loan()
//     .save({
//       user_id: user_id,
//       principle: principle,
//       duration: duration
//     });
// };



// exports.newLoan = function (req, res) {
//   var user_id = req.user;
//   var pin = req.body.pin;
//   var principle = req.body.principle;
//   var duration = req.body.duration;

//   new User({id: user_id}).fetch()
//   .then(function (user) {

//     userBalance = user.get('balance');
//     group_id = user.get('group_id'); 
//     return getGroupBalancesByUserID(user_id);
//   })
//   .then(function (balances) {

//     if (balances.available_balance > principle) {
//       changeGroupBalance(group_id, principle*-1, 0);
//       changeUserBalance(user_id, principle*-1);
//       addTransaction(user_id, principle*-1, "LOAN");
//       return addLoan(user_id, principle, duration);
//     } else {
//       throw new Error('Not Enough Funds!'); 
//     }
//   })
//   .then(function (loan) {
//     res.json({error: false, data: {loan: loan}});
//   })
//   .catch(function (err){
//     res.status(500).json({error: true, data: {message: err.message}});
//   });
// };


// var payLoan = function (loan, amount) {
//   //this part needs to be better, but I have it this way for now for simplicity
//   var toInterest = loan.dollarMonthlyInterest();
//   var toPrinciple = amount - toInterest;
//   return loan.save({amount_paid: toPrinciple})
//   .then(function (laon) {  
//     return {toInterest: toInterest, toPrinciple: toPrinciple};
//   });
// };

// //there will be rounding errors which will make the members add up to more
// //or less than the group balance. How should I fix this?
// var payGroup = function (group_id, pmt) {
//   var toInterest = pmt.toInterest;
//   var toPrinciple = pmt.toPrinciple;
//   var addToGroupBalance = 0;
//   var total = 0;
//   return new Group({id: group_id}).fetch({withRelated: ['users']})
//     .then(function (group) {
//       var members = (group.related('users'));
//       members.each(function(member) {
//         var memberBalance = member.get('balance');
//         if (memberBalance && memberBalance > 0) {
//           total += memberBalance;
//         }
//       });
//       members.each(function(member) {
//         var memberBalance = member.get('balance');

//         if (memberBalance && memberBalance > 0) {
//           var toAdd = (memberBalance / total) * toInterest;
//           changeUserBalance(member.get('id'), toAdd);
//           addToGroupBalance += toAdd;
//         }
//       });
//       return changeGroupBalance(group_id, toInterest + toPrinciple + addToGroupBalance, addToGroupBalance);
//     });
// };

// exports.newPayment = function (req, res) {

//   var user_id = req.body.user_id;
//   var amount = req.body.amount;
//   var loan_id;
//   var group_id;

//   new User({id: user_id}).fetch({withRelated: ['loan']})
//   .then(function (user) {

//     group_id = user.get('group_id');  
//     return payLoan(user.related('loan'), amount);
//   })
//   .then(function (pmts) {

//     changeUserBalance(user_id, pmts.toPrinciple);
//     payGroup(group_id, pmts);
//     return addTransaction(user_id, amount, "PAYMENT");
//   })
//   .then(function (transaction) {

//     res.json({error: false, data: {transaction: transaction}});
//   })
//   .catch(function (err){

//     res.status(500).json({error: true, data: {message: err.message}});
//   });
// };




// exports.getAllUsers = function (req, res) {
  
//   getAllX(req, res, User);
// };





/*******************************************
Transactions  *******************************
********************************************/

// exports.getAllTransactions = function (req, res) {
  
//   getAllX(req, res, Transaction);
// };




