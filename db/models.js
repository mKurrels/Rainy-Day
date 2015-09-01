var db = require('./db_config.js').db;

 // console.log("-------------------", bookshelf);

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
  }
});

exports.User = User;
// exports.Pot = Pot;
exports.Transaction = Transaction;
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
