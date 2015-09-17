var payment = angular.module('ff.payment', []);

payment.controller('paymentController', function ($cookies, $location, $scope, changeBalance, userInfo, loan, $rootScope) {

  console.log($cookies.get('userBalance'));

  // $scope.minMonthly = 10;
  $scope.groupTotal = $cookies.get('groupTotal');
  $scope.groupAvailable = $cookies.get('groupAvailable');
  $scope.yourBalance = $cookies.get('userBalance');
  $scope.canWithdraw = Math.min($scope.yourBalance, $scope.groupAvailable);
  $scope.loading = false;
  $scope.done = false;

  

  $scope.pay = function(amount) {
    $scope.yourBalance += amount;
    changeBalance.pay($scope.amount, function (err, toTotal, toAvailable) {
        $scope.loading = true;
        if(err) {
          displayError('err');
        } else {
          $scope.yourBalance += amount;
          $scope.groupTotal += toTotal;
          $scope.groupAvailable += toAvailable;
          $scope.loading = false;
          $scope.done = true;
        }
      }); 
    $scope.loading = true;
  };

  $scope.deposit = function(amount) {
    $scope.yourBalance += amount;
    changeBalance.deposit($scope.amount, function (err) {
        $scope.loading = true;
        if(err) {
          displayError('err');
        } else {
          $scope.yourBalance += amount;
          $scope.groupTotal += amount;
          $scope.groupAvailable += amount;
          $scope.loading = false;
          $scope.done = true;
        }
      }); 
    $scope.loading = true;
  };

  $scope.makeWithdraw = function (amount) {
    if (canWithdraw >= amount) {
      changeBalance.withdraw(amount, function (err) {
        $scope.loading = true;
        if(err) {
          displayError('err');
        } else {
          $scope.done = true;
          $scope.yourBalance -= amount;
          $scope.groupAvailable -=amount;
          $scope.loading = false;
        }
      }); 
    } else {
      displayError("not enough funds");
    }
  };

  $scope.getLoan = function (amount, duration) {
    if (amount <= $scope.groupTotal) {
      loan.requestLoan (amount, duration, function (err) {
        $scope.loading = true;
        if(err) {
          displayError('err');
        } else {
          $scope.done = true;
          $scope.yourBalance -= amount;
          $scope.groupAvailable -=amount;
          $scope.loading = false;
        }
      });
      
    }
    console.log(amount, duration);
    $scope.loading = true;
  };

  var displayError = function (message) {
    //TODO
  }

  $scope.bob = function (thing) {
    console.log(thing);
  };
  function show(form) {
    
    $scope.deposit = false;
    $scope.withdraw = false;
    $scope.loan = false;
    $scope.done = false;

    $scope[form] = true;
  }


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
