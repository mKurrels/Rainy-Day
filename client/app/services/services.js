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

.factory('changeBalance', function ($http) {
  
  var pay = function (amount, cb) {
    return $http({
      method: 'POST',
      url: 'api/payment',
      data: {user_id: 1, value: amount}
    })
    .then(function (res) {
      console.log(resp.data);
      return resp.data;
    }, function (res) {
      //TODO  
    });
  };

  var deposit = function (amount) {
    return $http({
      method: 'POST',
      url: 'api/deposit',
      data: {user_id: 1, value: amount}
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

var withdraw = function (amount) {
    return $http({
      method: 'POST',
      url: 'api/withdraw',
      data: {user_id: 1, value: amount}
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  return {
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
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  return {
    requestLoan: requestLoan
  };
})
// .factory('Authentication', function ($http, $httpProvider) {
  
//   $httpProvider.interceptors.push(function($q, $location) {
//     return { response: function(response) { 
//       return response; 
//     }, 
//     responseError: function(response) { 
//       if (response.status === 401) {
//         $location.url('/login'); 
//       }
//       return $q.reject(response); 
//     } 
//   };
// })


.factory('userInfo', function ($http, $location, $rootScope) {
  //hardcoded for now
  //TODO get Dwolla
  var info;
  // var user_id = 1;
  var getToken = function () {
    if($rootScope.token) {
      // $rootScope.token;
    } else {
      $http({
        method: 'GET',
        url: '/api/oauth_return2?code=' + $location.search().code
      })
      .then(function (resp) {
        console.log('yeppers');
        console.log(resp.data);
        cb(resp.data);
        $rootScope.token = resp.data;
      });
    }
  };

  return {
    // info: info,
    getToken: getToken
  };
});