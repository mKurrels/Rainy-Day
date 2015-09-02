angular.module('ff.services', [])
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

.factory('userInfo', function ($http) {
  //hardcoded for now
  //TODO get venmoID
  var user_id = 1;
  var getUserInfo = function (cb) {
    return $http({
      method: 'GET',
      url: '/api/users/' + user_id
    })
    .then(function (resp) {
      console.log('yeppers');
      console.log(resp.data);
      cb(resp.data);
    });
  };

  return {
    getUserInfo: getUserInfo
  };
});