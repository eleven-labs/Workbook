angular.module('resetPassword', ['services.localizedMessages'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/request/reset/password', {
      templateUrl:'controllers/resetPassword/templates/requestForm.tpl.html',
      controller:'ResetPasswordController'
    })
    .when('/reset/password', {
      templateUrl:'controllers/resetPassword/templates/resetForm.tpl.html',
      controller:'ResetPasswordController'
    });
}])

.controller('ResetPasswordController', ['$scope', '$location', 'security', 'localizedMessages', function($scope, $location, security, localizedMessages) {
  // The model for this form
  $scope.user = {};

  // Any error message from failing to resetPassword
  $scope.authError = null;

  $scope.requestedResetPassword = false;

  $scope.resetedPassword = false;

  // Attempt to authenticate the user specified in the form's model
  $scope.requestResetPassword = function() {
    // Clear any previous security errors
    $scope.authError = null;

    security.requestResetPassword($scope.user.email).then(function() {
      $scope.requestedResetPassword = true;
    }, function(x) {
      $scope.authError = localizedMessages.get('resetPassword.error.serverError', { exception: x });
    });
  };

  $scope.resetPassword = function() {
    security.resetPassword($location.$$search['key'], $scope.user.password).then(function() {
      $scope.resetedPassword = true;
    }, function(x) {
      $scope.authError = localizedMessages.get('resetPassword.error.serverError', { exception: x });
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };
}]);
