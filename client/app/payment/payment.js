var payment = angular.module('ff.payment', []);

payment.controller('paymentController', function ($scope, makePayment, userInfo) {
  // $scope.value = 
  userInfo.getUserInfo(function (data) {
    $scope.userData = data.data.value;
  });
  $scope.bob = 'bobbob';
  $scope.pay = function(amount) {
    makePayment.pay($scope.amount); 
  };
});
