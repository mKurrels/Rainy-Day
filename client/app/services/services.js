angular.module('ff.services', [])

// .factory('authorize', function ($http, $location) {
  
//   // var getRedirect = function (amount) {
//   //   return $http({
//   //     method: 'GET',
//   //     url: 'api/auth',
//   //   })
//   //   .then(function (resp) {
//   //     $location.path(resp.data);
//   //     console.log(resp.data);
//   //   });
//   // };

//   // return {
//   //   getRedirect: getRedirect
//   // };
// })

.factory('makePayment', function ($http) {
  
  var pay = function (amount) {
    return $http({
      method: 'POST',
      url: 'api/transactions',
      data: {user_id: 1, value: amount}
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  return {
    pay: pay
  };
})

.factory('loan', function ($http) {
  
  var requestLoan = function (amount, duration) {
    return $http({
      method: 'POST',
      url: 'api/loans',
      data: {user_id: 1, principle: amount, duration: duration}
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  return {
    requestLoan: requestLoan
  };
})

.factory('userInfo', function ($http) {
  //hardcoded for now
  //TODO get Dwolla
  var info;
  var user_id = 1;
  var getUserInfo = function (cb) {
    if(info) {
      cb(info);
    } else {
      $http({
        method: 'GET',
        url: '/api/users/' + user_id
      })
      .then(function (resp) {
        console.log('yeppers');
        console.log(resp.data);
        cb(resp.data);
        info = resp.data;
      });
    }
  };

  return {
    // info: info,
    getUserInfo: getUserInfo
  };
});