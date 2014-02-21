angular.module('signup', ['services.localizedMessages'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/signup', {
      templateUrl:'templates/signup/form.tpl.html',
      controller:'SignupFormController'
    });
}])

.controller('SignupFormController', ['$scope', 'security', 'localizedMessages', function($scope, security, localizedMessages) {
  // The model for this form
  $scope.user = {};

  // Any error message from failing to signup
  $scope.authError = null;

  $scope.signedUp = false;

  // Attempt to authenticate the user specified in the form's model
  $scope.signup = function() {
    // Clear any previous security errors
    $scope.authError = null;

    // Try to signup
    security.signup($scope.user.email, $scope.user.password).then(function() {
      $scope.signedUp = true;
    }, function(x) {
      // If we get here then there was a problem with the signup request to the server
      $scope.authError = localizedMessages.get('signup.error.serverError', { exception: x });
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };
}]);
