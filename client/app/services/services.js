angular.module('ff.services', [])
.factory('makePayment', function ($http) {
  
  var pay = function (amount) {
    return $http({
      method: 'POST',
      url: '/payment',
      data: {amount: amount}
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