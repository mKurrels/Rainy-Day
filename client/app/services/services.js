angular.module('ff.services', [])

.factory('changeBalance', function ($http, $location) {
  
  var pay = function (amount, cb) {
    return $http({
      method: 'POST',
      url: 'api/payment',
      data: {user_id: 1, value: amount}
    })
    .then(function (res) {
      console.log(res.data);
      return res.data;
    }, function (res) {
      //TODO  
    });
  };

  var deposit = function (amount, cb) {
    return $http({
      method: 'POST',
      url: 'api/deposit',
      data: {amount: amount}
    })
    .then(function (res) {
      cb();
      console.log(res.data);
      return res.data;
    }, function (res) {
      console.log("=======================", res.status);
      if (res.status === 403) {
        $location.path('/auth');
        alert('invalid request: please sign in');
      } else {
        cb(res.data);
      }
    });
  };

  var withdraw = function (amount) {
    return $http({
      method: 'POST',
      url: 'api/withdraw',
      data: {user_id: 1, value: amount}
    })
    .then(function (res) {
      console.log(res.data);
      return res.data;
    });
  };

  return {
    deposit: deposit,
    pay: pay,
    withdraw: withdraw
  };
})

.factory('loan', function ($http) {
  
  var requestLoan = function (amount, duration) {
    return $http({
      method: 'POST',
      url: 'api/loans',
      data: {user_id: 1, principle: amount, duration: duration}
    })
    .then(function (res) {
      console.log(res.data);
      return res.data;
    });
  };

  return {
    requestLoan: requestLoan
  };
})


.factory('userInfo', function ($http, $location, $rootScope) {
  var info;
  var getInfo = function (cb) {
    $http({
      method: 'GET',
      url: '/api/user'
    })
    .then(function (res) {
      console.log('yeppers', 'res', res);
      $rootScope.data = res.data;
      cb();
    }, function (res) {
      console.log("=======================", res.status);
      if (res.status === 403) {
        $location.path('/auth');
        alert('invalid request: please sign in');
      } else {
        cb(res.data);
      }
    });
  };

  return {
    getInfo: getInfo
  };
});