angular.module('ff.services', [])
.factory('makePayment', function ($http) {
  
  var pay = function (amount) {
    return $http({
      method: 'POST',
      url: '/transactions',
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

.factory('userInfo', function ($http) {
  //hardcoded for now
  //TODO get venmoID
  var user_id = 1;
  var getUserInfo = function () {
    console.log('yeppers');
    return $http({
      method: 'GET',
      url: '/api/users/:id',
      params: {user_id: user_id}
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  return {
    getUserInfo: getUserInfo
  };
});