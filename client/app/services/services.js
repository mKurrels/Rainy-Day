angular.module('ff.services', [])

.factory('changeBalance', function ($http, $location) {
  
  var pay = function (amount, cb) {

    return $http({
      method: 'POST',
      url: 'api/payment',
      data: {user_id: 1, value: amount}
    })

    .then(function (res) {
      return res.data;
    }, function (res) {
      //TODO  
    });
  };

  var deposit = function (amount, pin, cb) {

    return $http({
      method: 'POST',
      url: 'api/deposit',
      data: {amount: amount, pin: pin}
    })

    .then(function (res) {
      cb();
      return res.data;
    }, function (res) {
      if (res.status === 403) {
        $location.path('/auth');
        alert('invalid request: please sign in');
      } else {
        cb(res.data);
      }
    });
  };

  var withdraw = function (amount, pin, cb) {
    return $http({
      method: 'POST',
      url: 'api/withdraw',
      data: {amount: amount, pin: pin}
    })

    .then(function (res) {
      cb();
      return res.data;
    }, function (res) {
      if (res.status === 403) {
        $location.path('/auth');
        alert('invalid request: please sign in');
      } else {
        cb(res.data);
      }
    });
  };

  return {
    deposit: deposit,
    pay: pay,
    withdraw: withdraw
  };
})

.factory('loan', function ($http) {
  
  var requestLoan = function (amount, duration, pin, cb) {

    return $http({
      method: 'POST',
      url: 'api/loans',
      data: {principle: amount, pin: pin, duration: duration}
    })

    .then(function (res) {
      cb();
      return res.data;
    }, function (res) {
      if (res.status === 403) {
        $location.path('/auth');
        alert('invalid request: please sign in');
      } else {
        cb(res.data);
      }
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
      $rootScope.data = res.data;
      cb();
    }, function (res) {
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