var ff = angular.module('ff', [
  'ff.auth',
  'ff.payment',
  'ff.services',
  'ngRoute',
  'ui.router',
  'ngCookies'
]);

ff.config(function($routeProvider, $httpProvider, $urlRouterProvider) {

  $routeProvider
    .when('/payment', {
      templateUrl: 'app/payment/payment.html',
      controller: 'paymentController'
    })
    .when('/auth', {
      templateUrl: 'app/auth/auth.html',
      controller: 'authController'
    })
    .otherwise({
      redirectTo: '/auth'
    });
});