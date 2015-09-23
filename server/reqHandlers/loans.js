
var Loan = require('../../db/models').Loan;
var utils = require('./utils');


exports.addLoan = function (user_id, principle, duration) {
  
  return new Loan()
    .save({
      user_id: user_id,
      principle: principle,
      duration: duration
    });
};


exports.getLoans = function (req, res) {
  
  utils.getAllX(req, res, Loan);
};


exports.payLoan = function (loan, amount) {

  //this part needs to be better, but I have it this way for now for simplicity
  var toInterest = loan.dollarMonthlyInterest();
  var toPrinciple = amount - toInterest;
  return loan.save({amount_paid: toPrinciple})
  .then(function (laon) {  
    return {toInterest: toInterest, toPrinciple: toPrinciple};
  });
};