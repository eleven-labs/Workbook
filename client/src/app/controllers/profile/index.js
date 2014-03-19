angular.module('profile', ['resources.users', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'controllers/profile/templates/edit.tpl.html',
    controller:'ProfileEditCtrl',
    resolve:{
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ProfileEditCtrl', ['$scope', '$location', '$timeout', 'security', 'Users', function ($scope, $location, $timeout, security, Users) {
  $scope.user = security.currentUser;

  $scope.master = angular.copy($scope.user);

  $scope.saved = false;

  var updateSuccess = function() {
    $scope.master = angular.copy($scope.user);
    $scope.saved = true;
    $timeout(function(){ $scope.saved = false; }, 2000);
  };

  var failsRequest = function() {
    console.log('error');
  };

  $scope.update = function() {
   new Users($scope.user).$update(updateSuccess, failsRequest);
  };

  $scope.reset = function() {
    $scope.user = angular.copy($scope.master);
  };

  $scope.isUnchanged = function() {
    return angular.equals($scope.user, $scope.master);
  };
}]);
