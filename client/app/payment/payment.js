var payment = angular.module('ff.payment', []);

payment.controller('paymentController', function ($cookies, $location, $scope, changeBalance, userInfo, loan, $rootScope) {

  userInfo.getInfo(setUp);

  $scope.makeDeposit = function(amount, pin) {

    $scope.isLoading = true;
    changeBalance.deposit(amount, pin, function (err) {

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


  $scope.makeWithdraw = function (amount, pin) {

    $scope.isLoading = true;
    
    if ($scope.canWithdraw >= amount) {
      changeBalance.withdraw(amount, pin, function (err) {
        
        if(err) {
          displayError(err);
        } else {
          $scope.yourBalance -= amount;
          $scope.groupAvailable -=amount;
          $scope.groupTotal -=amount;
          reset();
          $scope.successMessage = "your withdraw has been processed!";
          $scope.isDone = true;
        }
      }); 
    
    } else {
      displayError("not enough funds");
    }
  };

  $scope.getLoan = function (amount, duration, pin) {

    $scope.isLoading = true;

    if (amount <= $scope.groupTotal) {
      loan.requestLoan (amount, duration, pin, function (err) {

        $scope.isLoading = true;
        if(err) {
          displayError(err);
        } else {
          $scope.yourBalance -= amount;
          $scope.groupAvailable -=amount;
          reset();
          $scope.successMessage = "your loan has been processed!";
          $scope.isDone = true;
        }
      });
      
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
  }

  function displayError(message) {
    //TODO
    console.log("sorry, transaction did not go through: ", message);
  }


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
    $scope.withdraw = false;
    $scope.loan = false;
    updateLocalStorage();
  }

  function updateLocalStorage() {

    localStorage.setItem("userData",  { groupTotal: $scope.groupTotal,
                                  groupAvailable: $scope.groupAvailable,
                                  yourBalance: $scope.yourBalance });                              
  }


  //set up page
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
