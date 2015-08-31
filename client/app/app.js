var ff = angular.module('ff', [
  'ff.payment',
  'ff.services',
  'ngRoute'
]);

ff.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/payment', {
      templateUrl: 'app/payment/payment.html',
      controller: 'paymentController'
    });
});