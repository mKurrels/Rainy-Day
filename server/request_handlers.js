var User = require('../db/models').User;

exports.postUser = function (req, res) {
  newUser = req.body; 
  console.log("newUser", newUser);
  // {venmoID: '', value: 1111, isManager: true, fundID: ''}
  User.forge(newUser).save()
    .then(function (user) {
      console.log(user);
      res.send(user.get('venmoID'));
    });
};

exports.getUser = function (req, res) {
  new User()
    .fetch()
    .then(function(model) {
      // outputs 'Slaughterhouse Five'
      console.log(model.get('venmoID'), '3420958723049587');
      console.log(model.get('fund_id'), '3420958723049587');
    });
};