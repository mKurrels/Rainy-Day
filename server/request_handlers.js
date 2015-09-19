var Group = require('../db/models').Group;
var User = require('../db/models').User;
var Transaction = require('../db/models').Transaction;
var Loan = require('../db/models').Loan;

/*******************************************
helpers  *************************************
********************************************/


var postX = function (req, res, model) {
  x = req.body;
  console.log('xxxxxxx', x);
  new model().save(x)
    .then(function (y) {
      console.log('y', y);
      res.json({error: false, data: y});
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


/*******************************************
Groups  *************************************
********************************************/

exports.postGroup = function (req, res) {
  console.log('posting to group')
  postX(req, res, Group);
};

exports.getGroups = function (req, res) {
  console.log('getGroups');
  getAllX(req, res, Group);
};


exports.getLoans = function (req, res) {
  console.log('getLoans');
  getAllX(req, res, Loan);
};
/*******************************************
USERS  *************************************
********************************************/

exports.postUser = function (req, res) {
  console.log('user', req.body);
  return new User(req.body).save()
    .then(function(user) {
      console.log("we did it!!!!!!!", {user: user});
      res.json(user);
    })
    .catch(function(err){
      res.status(500).send(err);
    });
};


var changeUserBalance = function (user_id, amount) {
  return new User({id: user_id}).fetch()
    .then(function(user){
      return user.save({balance: user.get('balance') + amount});
    });
};

var changeGroupBalance = function (group_id, changeAvailable, changeTotal) {
  console.log('got to the place', group_id, changeAvailable, changeTotal);
  return new Group({id: group_id}).fetch()
    .then(function(group){
      return group.save({
        available_balance: group.get('available_balance')*1 + changeAvailable*1,
        balance: group.get('balance')*1 + changeTotal*1
      });
    });
};

var addTransaction = function (user_id, value, type) {
  console.log('userid', user_id, 'value', value, 'type', type);
  return new Transaction()
    .save({
      user_id: user_id,
      value: value,
      type: type
    });
};

exports.deposit = function (req, res) {
  console.log('got here ==================', req.body, 'req.user', req.user);
  var user_id = req.user;
  var amount = req.body.amount;
  var group_id;
  changeUserBalance(user_id, amount)
    .then(function (user) {
      console.log('1 got here');
      group_id = user.get('group_id');
      changeGroupBalance(group_id, amount, amount);
      return addTransaction(user_id, amount, "DEPOSIT");
    })
    .then(function (transaction) {
      console.log('3 got here');
      res.json({error: false, data: {transaction: transaction}});
    })
    .catch(function (err){
      console.log(err.message);
      res.status(500).json({error: true, data: {message: err.message}});
    });
};


var getUserByID = function (user_id) {
  return new User({id: user_id}).fetch()
    .then(function (user) {
      return user;
    });
};

var getGroupBalancesByUserID = function (user_id) {
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

exports.withdraw = function (req, res) {
  var user_id = req.body.user_id;
  var amount = req.body.amount;
  var userBalance;
  var group_id;
  new User({id: user_id}).fetch()
    .then(function (user) {
      console.log('1');
      userBalance = user.get('balance');
      group_id = user.get('group_id'); 
      return getGroupBalancesByUserID(user_id);
    })
    .then(function (balances) {
      console.log('3');

      if (userBalance > amount && balances.available_balance > amount) {
        console.log('4', 'amount', amount);
        changeGroupBalance(group_id, amount*-1, amount*-1);
        changeUserBalance(user_id, amount*-1);
        return addTransaction(user_id, amount*-1, "WITHDRAW");
      } else {
        throw new Error('Not Enough Funds!'); 
      }

    })
    .then(function (transaction) {

      console.log('3 got here to withdraw end');
      res.json({error: false, data: {transaction: transaction}});
    })
    .catch(function (err){
      console.log(err.message);
      res.status(500).json({error: true, data: {message: err.message}});
    });
};

var addLoan = function (user_id, principle, duration) {
  console.log('@@@@@@@@@@ addloan', user_id, principle, duration);
  return new Loan()
    .save({
      user_id: user_id,
      principle: principle,
      duration: duration
    });
};



exports.newLoan = function (req, res) {

  var user_id = req.body.user_id;
  var principle = req.body.principle;
  var duration = req.body.duration;

  new User({id: user_id}).fetch()
  .then(function (user) {

    console.log('1');
    userBalance = user.get('balance');
    group_id = user.get('group_id'); 
    return getGroupBalancesByUserID(user_id);
  })
  .then(function (balances) {

    console.log('3');
    if (balances.available_balance > principle) {
      console.log('4', 'principle', principle);
      changeGroupBalance(group_id, principle*-1, 0);
      changeUserBalance(user_id, principle*-1);
      addTransaction(user_id, principle*-1, "LOAN");
      return addLoan(user_id, principle, duration);
    } else {
      throw new Error('Not Enough Funds!'); 
    }
  })
  .then(function (loan) {

    console.log('3 got here to withdraw end');
    res.json({error: false, data: {loan: loan}});
  })
  .catch(function (err){

    console.log(err.message);
    res.status(500).json({error: true, data: {message: err.message}});
  });
};


var payLoan = function (loan, amount) {
 
  console.log(loan, 'loan');

  //this part needs to be better, but I have it this way for now for simplicity
  var toInterest = loan.dollarMonthlyInterest();
  var toPrinciple = amount - toInterest;
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%% toInterest', toInterest, 'toPrinciple', toPrinciple);
  return loan.save({amount_paid: toPrinciple})
  .then(function (laon) {  
    return {toInterest: toInterest, toPrinciple: toPrinciple};
  });
};

//there will be rounding errors which will make the members add up to more
//or less than the group balance. How should I fix this?
var payGroup = function (group_id, pmt) {
  var toInterest = pmt.toInterest;
  var toPrinciple = pmt.toPrinciple;
  var addToGroupBalance = 0;
  // console.log('toInterest', toInterest, 'toPrinciple', toPrinciple);
  var total = 0;
  return new Group({id: group_id}).fetch({withRelated: ['users']})
    .then(function (group) {
      // console.log('---------------------- group', group);
      var members = (group.related('users'));
      // console.log('---------------------- members', JSON.stringify(members));
      members.each(function(member) {
        var memberBalance = member.get('balance');
        if (memberBalance && memberBalance > 0) {
          total += memberBalance;
        }
      });
        // async (maybe eachseries)
      members.each(function(member) {
        var memberBalance = member.get('balance');
        // console.log('----------------------1 memberBalance', memberBalance, total);

        if (memberBalance && memberBalance > 0) {
          var toAdd = (memberBalance / total) * toInterest;
          // console.log('userBalance', toAdd + memberBalance);
          changeUserBalance(member.get('id'), toAdd);
          addToGroupBalance += toAdd;
        }
      });
      return changeGroupBalance(group_id, toInterest + toPrinciple + addToGroupBalance, addToGroupBalance);
    });
};
 // payGroup(1, 6);

exports.newPayment = function (req, res) {
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%% newPayment');

  var user_id = req.body.user_id;
  var amount = req.body.amount;
  var loan_id;
  var group_id;

  new User({id: user_id}).fetch({withRelated: ['loan']})
  .then(function (user) {

    console.log('1', /*JSON.stringify(*/user.related('loan')/*)*/);
    group_id = user.get('group_id');  
    return payLoan(user.related('loan'), amount);
  })
  .then(function (pmts) {

    console.log('2  pmts', pmts);
    changeUserBalance(user_id, pmts.toPrinciple);
    payGroup(group_id, pmts);
    return addTransaction(user_id, amount, "PAYMENT");
  })
  .then(function (transaction) {

    console.log('3 got here to withdraw end');
    res.json({error: false, data: {transaction: transaction}});
  })
  .catch(function (err){

    console.log(err.message);
    res.status(500).json({error: true, data: {message: err.message}});
  });
};




exports.getAllUsers = function (req, res) {
  getAllX(req, res, User);
};


var getAllUserInfoByID = function (user_id, cb, errCb) {
  console.log("got to getAllUserInfoByID", "user_id", user_id);
  var balance = 0;
  var group_id;
  User.forge({id: user_id})
    .fetch({require: true, withRelated: ['transactions']})
    .then(function (user) {
      console.log("got to first .then in getAllUserInfoByID");
      User.where({group_id: user.get('group_id')})
        .fetchAll({withRelated: ['transactions']})
        .then(function (collection) {
          collection.each(function(model) {
            var transactions = model.related('transactions');
            transactions.each(function (transaction) {
              balance += transaction.get('value');
            });
          });
          console.log("got to right before callback");
          console.log('balance', balance, 'group_id', group_id);
          cb(balance, user);
        });
    })
    .catch(function (err) {
      console.log("oops!, I errored", err);
      if (!errCb) {
        console.log(err);
      } else {
        errCb(err);
      }
    });
};

exports.getUserInfoByCode = function (req, res) {

  getAllUserInfoByID(req.params.code, respond, error);
  
  function respond(balance, user) {
    res.json({error: false, user: user, groupBalance: balance});
  }

  function error (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  }

};



/*******************************************
Transactions  *******************************
********************************************/

exports.getAllTransactions = function (req, res) {
  console.log('get Transactions');
  getAllX(req, res, Transaction);
};

// exports.postTransaction = function (req, res) {
//   var user_id = req.body.user_id;
//   var value = req.body.value;

//   getAllUserInfoByID(user_id, makeNewTransaction);

//   function makeNewTransaction(balance, user) {
//     var loan_id = user.get('loan_id');
//     var monthlyInterest;

//     new Loan({id: loan_id})
//       .fetch()
//       .then(function (loan) {
//         monthlyInterest = loan.dollarMonthlyInterest();
        
//       });
//     var newTransaction = new Transaction ({'value': value, 'user_id': user_id});
//     newTransaction.save()
//       .then(function(transaction) {
//         console.log("we did it!!!!!!!", {transaction: transaction});
//         res.json({id: transaction.id});
//       })
//       .catch(function(err){
//         res.status(500).send(err);
//       });
    
//   }
// };


