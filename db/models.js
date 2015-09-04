var db = require('./db_config.js').db;

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  // pot: function() {
  //   return this.belongsTo(Pot);
  // },
  transactions: function() {
    return this.hasMany(Transaction);
  }
});

// var Pot = db.Model.extend({
//   tableName: 'pots',
//   hasTimestamps: true,
//   users: function() {
//     return this.hasMany(User);
//   }
// });

var Transaction = db.Model.extend({
  tableName: 'transactions',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  },
  loan: function() {
    return this.belongsTo(Loan);
  }
});

var Loan = db.Model.extend({
  tableName: 'loans',
  hasTimestamps: true,
  defaults: {
    interest:  0.06,
    status: 'inProgress',
  },
  user: function() {
    return this.belongsTo(User);
  },
  transactions: function() {
    return this.hasMany(Transaction);
  },
  totalExpectedAmount: function () {
    // var principle = this.get('principle');
    // var duration = this.get('duration');

    // return 
  },
  monthlyInterest: function() {
    return /*(this.get('interest') / 12) */ this.get('principle');
  }
});


exports.User = User;
exports.Transaction = Transaction;
exports.Loan = Loan;
// exports.Pot = Pot;
// console.log(User, 'user', new User());

// User.forge({'venmoID': 'vasdjf;ljklue'}).save()
//   .then(function (user) {
//       console.log('venmo__________________', user.get('venmoID'));
//     })
//   .then(function () {
//     new User()
//       .fetch()
//       .then(function(model) {
//         // outputs 'Slaughterhouse Five'
//         console.log(model.get('venmoID'), '3420958723049587');
//         console.log(model.get('fund_id'), '3420958723049587');
//       });
//   });
