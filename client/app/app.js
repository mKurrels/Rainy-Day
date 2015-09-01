var ff = angular.module('ff', [
  'ff.auth',
  'ff.payment',
  'ff.services',
  'ngRoute'
]);

ff.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/payment', {
      templateUrl: 'app/payment/payment.html',
      controller: 'paymentController'
    })
    .when('/auth', {
      templateUrl: 'app/auth/auth.html',
      controller: 'authController'
    });
});