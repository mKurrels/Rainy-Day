var db = require('./db_config.js').db;

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  transactions: function() {
    return this.hasMany(Transaction);
  },
  group: function() {
    return this.belongsTo(Group);
  },
  loan: function() {
    return this.hasOne(Loan);
  },
  defaults: {
    balance:  0,
  },
});


var Transaction = db.Model.extend({
  tableName: 'transactions',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

var Group = db.Model.extend({
  tableName: 'groups',
  hasTimestamps: true,
  users: function() {
    return this.hasMany(User);
  },
  defaults: {
    balance:  0,
    available_balance: 0,
  },
});

var Loan = db.Model.extend({
  tableName: 'loans',
  hasTimestamps: true,
  defaults: {
    interest:  0.06,
    status: 'inProgress',
    amount_paid: 0
  },
  user: function() {
    return this.belongsTo(User);
  },
  dollarMonthlyInterest: function() {
    return (this.get('principle') * this.get('interest')) / this.get('duration'); //(100 * .06) / 12;
  }
});


exports.User = User;
exports.Transaction = Transaction;
exports.Loan = Loan;
exports.Group = Group;

