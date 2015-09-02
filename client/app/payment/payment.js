var payment = angular.module('ff.payment', []);

payment.controller('paymentController', function ($scope, makePayment, userInfo, loan) {

  userInfo.getUserInfo(function (data) {
    sum = 0;
    var payments = data.data.transactions;
    console.log('payments', payments);
    for (var i = 0; i < payments.length; i++) {
      sum += payments[i].value;
    }
    $scope.value = sum;
  });

  $scope.bob = 'bobbob';
  $scope.pay = function(amount) {
    $scope.value += amount;
    makePayment.pay($scope.amount); 
  };


  $scope.getLoan = function (amount, duration) {
    loan.requestLoan (amount, duration);
    $scope.value += amount;
  };
});
