angular.module('profile', ['resources.users', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'templates/profile/edit.tpl.html',
    controller:'ProfileEditCtrl',
    resolve:{
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ProfileEditCtrl', ['$scope', '$location', 'security', function ($scope, $location, security) {
  $scope.user = security.currentUser;
}]);
