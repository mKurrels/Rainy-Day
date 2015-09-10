var ff = angular.module('ff', [
  'ff.auth',
  'ff.payment',
  'ff.services',
  'ngRoute',
  'ui.router'
]);

ff.config(function($routeProvider, $httpProvider, $urlRouterProvider) {

  //this doesn't work for some reason:
  //$urlRouterProvider.otherwise('/payment');

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