var payment = angular.module('ff.payment', []);

payment.controller('paymentController', function ($location, $scope, makePayment, userInfo, loan, $rootScope) {

  // console.log($location.path());
  // console.log($location.search().code);
  // console.log($location.hash());

  // userInfo.getToken();
  $scope.minMonthly = 10;
  $scope.groupTotal = "  " + 1;
  $scope.groupAvailable = "  " + 2;
  $scope.yourBalance = "  " +   5;
  $scope.canWithdraw = Math.min($scope.yourBalance, $scope.groupAvailable)
  $scope.loading = false;
  $scope.done = false;


  var show = function (form) {
    
    $scope.deposit = false;
    $scope.withdraw = false;
    $scope.loan = false;
    $scope.done = false;

    $scope[form] = true;
  };

  
  $scope.pay = function(amount) {
    $scope.value += amount;
    makePayment.pay($scope.amount); 
    $scope.loading = true;
  };
  $scope.getLoan = function (amount, duration) {
    // loan.requestLoan (amount, duration);
    console.log(amount, duration);
    $scope.loading = true;
  };
  $scope.makeWithdraw = function (amount) {
    $scope.value -= amount;
    makePayment.pay(-($scope.amount), function (err) {
      $scope.loading = true;
      if(err) {

      } else {
        $scope.done = true;

      }
    }); 
    $scope.loading = true;
  };

  $scope.bob = function (thing) {
    console.log(thing);
  };


  $('select').material_select();
  $('li').click(function() {
    if ($(this).find('span').text() === 'Deposit Money') {
      show('deposit');
      $scope.$apply();
    } 
    if ($(this).find('span').text() === 'Withdraw Money') {
      show('withdraw');
      $scope.$apply();
    } 
    if ($(this).find('span').text() === 'Get a Loan') {
      show('loan');
      $scope.$apply();
    } 
  });

});
