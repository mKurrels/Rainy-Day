var Transaction = require('../../db/models').Transaction;


exports.addTransaction = function (user_id, value, type) {
  
  return new Transaction()
    .save({
      user_id: user_id,
      value: value,
      type: type
    });
};

exports.getAllTransactions = function (req, res) {
  
  getAllX(req, res, Transaction);
};
