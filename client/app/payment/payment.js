var payment = angular.module('ff.payment', []);

payment.controller('paymentController', function ($cookies, $location, $scope, changeBalance, userInfo, loan, $rootScope) {

  userInfo.getInfo(setUp);

  function setUp (err) {
    if (err) {
      //todo
    } else {
      var data = $rootScope.data;
      $scope.groupTotal = data.groupTotal;
      $scope.groupAvailable = data.groupAvailable;
      $scope.yourBalance = data.userBalance;
      updateLocalStorage();

      $scope.canWithdraw = Math.min($scope.yourBalance, $scope.groupAvailable);
      $scope.isLoading = false;
      $scope.isDone = false;
    }
  };

  

  $scope.pay = function(amount) {
    $scope.yourBalance += amount;
    changeBalance.pay($scope.amount, function (err, toTotal, toAvailable) {
        $scope.isLoading = true;
        if(err) {
          displayError(err);
        } else {
          $scope.yourBalance += amount;
          $scope.groupTotal += toTotal;
          $scope.groupAvailable += toAvailable;
          $scope.isLoading = false;
          $scope.isDone = true;
        }
      }); 
    $scope.isLoading = true;
  };

  $scope.makeDeposit = function(amount) {
    $scope.isLoading = true;
    changeBalance.deposit(amount, function (err) {
        console.log('in callback');
        if(err) {
          displayError(err);
        } else {
          $scope.yourBalance = $scope.yourBalance*1 + amount*1;
          $scope.groupTotal = $scope.groupTotal*1 + amount*1;
          $scope.groupAvailable = $scope.groupAvailable*1 + amount*1;
          reset();
          $scope.successMessage = "your deposit has been processed!";
          $scope.isDone = true;
        }
      }); 
    $scope.isLoading = false;
  };


  $scope.makeWithdraw = function (amount) {
    if (canWithdraw >= amount) {
      changeBalance.withdraw(amount, function (err) {
        $scope.isLoading = true;
        if(err) {
          displayError(err);
        } else {
          $scope.isDone = true;
          $scope.yourBalance -= amount;
          $scope.groupAvailable -=amount;
          $scope.isLoading = false;
        }
      }); 
    } else {
      displayError("not enough funds");
    }
  };

  $scope.getLoan = function (amount, duration) {
    if (amount <= $scope.groupTotal) {
      loan.requestLoan (amount, duration, function (err) {
        $scope.isLoading = true;
        if(err) {
          displayError(err);
        } else {
          $scope.isDone = true;
          $scope.yourBalance -= amount;
          $scope.groupAvailable -=amount;
          $scope.isLoading = false;
        }
      });
      
    }
    console.log(amount, duration);
    $scope.isLoading = true;
  };

  var displayError = function (message) {
    //TODO
    alert("sorry, transaction did not go through: " + message);
  };

  $scope.bob = function (thing) {
    console.log(thing);
  };
  function show(form) {
    
    $scope.deposit = false;
    $scope.withdraw = false;
    $scope.loan = false;
    $scope.isDone = false;

    $scope[form] = true;
  }

  function reset() {
    $scope.isLoading = false;
    $scope.deposit = false;
    console.log('reset called');
    updateLocalStorage();
  }

  function updateLocalStorage () {
    localStorage.setItem("userData",  { groupTotal: $scope.groupTotal,
                                  groupAvailable: $scope.groupAvailable,
                                  yourBalance: $scope.yourBalance });                              
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
