angular.module('ff.services', [])
.factory('makePayment', function ($http) {
  
  var pay = function (amount) {
    return $http({
      method: 'POST',
      url: '/api/payments',
      //user_id hardcode for now, will have to 
      //actually get the id in the future when i 
      //have integrated venmo api
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