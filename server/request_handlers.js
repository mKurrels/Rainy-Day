var User = require('../db/models').User;
console.log('user', User);

exports.postUser = function (req, res) {
  newUser = req.body; 
  User.forge(newUser).save()
    .then(function (user) {
      console.log(user);
      res.send(user.get('venmoID'));
    });
};

exports.getAllUsers = function (req, res) {
  new User()
  .fetchAll()
    .then(function(user) {
      res.send(user.models);
    })
    .catch(function(error) {
      console.log(error);
      res.send('An error occured');
    });
};