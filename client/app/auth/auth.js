var auth = angular.module('ff.auth', []);

auth.controller('authController', function ($scope, $location, userInfo) {
  // $scope.value = 
  $location.path('/payment');
});
