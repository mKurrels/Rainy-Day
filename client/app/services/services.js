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
});