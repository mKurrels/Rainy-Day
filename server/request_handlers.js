var Group = require('../db/models').Group;
var User = require('../db/models').User;
var Transaction = require('../db/models').Transaction;
var Loan = require('../db/models').Loan;


var postX = function (req, res, model) {
  x = req.body;
  console.log('x', x);
  model.forge(x).save()
    .then(function (x) {
      res.json({x: x});
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

  postX(req, res, Group);
};

exports.getGroups = function (req, res) {
  console.log('getGroups');
  getAllX(req, res, Group);
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
  console.log('got to the place', group_id);
  return new Group({id: group_id}).fetch()
    .then(function(group){
      group.save({
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
  console.log('got here');
  var user_id = req.body.user_id;
  var amount = req.body.amount;
  var group_id;
  changeUserBalance(user_id, amount)
    .then(function (user) {
      console.log('1 got here');
      group_id = user.get('group_id');
      return changeGroupBalance(group_id, amount, amount);
    })
    .then(function (group) {
      console.log('2 got here');
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
        changeGroupBalance(user_id, amount*-1, amount*-1);
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

exports.getUserInfoByID = function (req, res) {

  getAllUserInfoByID(req.params.id, respond, error);
  
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

exports.postTransaction = function (req, res) {
  var user_id = req.body.user_id;
  var value = req.body.value;

  getAllUserInfoByID(user_id, makeNewTransaction);

  function makeNewTransaction(balance, user) {
    var loan_id = user.get('loan_id');
    var monthlyInterest;

    new Loan({id: loan_id})
      .fetch()
      .then(function (loan) {
        monthlyInterest = loan.dollarMonthlyInterest();
        
      });
    var newTransaction = new Transaction ({'value': value, 'user_id': user_id});
    newTransaction.save()
      .then(function(transaction) {
        console.log("we did it!!!!!!!", {transaction: transaction});
        res.json({id: transaction.id});
      })
      .catch(function(err){
        res.status(500).send(err);
      });
    
  }
};


/*******************************************
LOANS  *************************************
********************************************/



exports.newLoan = function (req, res) {
  var user_id = req.body.user_id;
  var principle = req.body.principle;
  var duration = req.body.duration;
  console.log("got to newLoan", user_id, principle, duration);
  getAllUserInfoByID(user_id, makeNewLoan);

  function makeNewLoan(balance, user) {
    console.log("got to makeNewLoan", "balance", balance, "user", user);
    if (principle > balance) {
      console.log("oops, not enough funds");
      res.json("not enough funds");
    } else
    if (principle <= balance) {
      var newLoan = new Loan ({'principle': principle, 'user_id': user_id, 'duration': duration});
      newLoan.save()
        .then(function(loan) {
          console.log("added a loan!!!", loan);
          var newTransaction = new Transaction ({'value': principle * -1, 'user_id': user_id, 'loan_id': loan.get('id')});
          newTransaction.save()
            .then(function(transaction) {
              console.log("added a transaction!!!!!!!", {transaction: transaction});
              res.json ({loan: loan, transaction: transaction});
            });
          new User({id: user_id}).save({loan_id: loan.get('id')});
        })
        .catch(function(err){
          console.error("oops! error", err);
          res.status(500).send(err);
        });
    }
    
  }

  // }


    
};

//********* TODO:
// exports.getPotByUserId = function (req, res) {
//   console.log(req.params);
// };

// exports.getAllUsersByPot = function (req, res) {

// };


