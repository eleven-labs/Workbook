angular.module('profile', ['resources.users', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'templates/profile/edit.tpl.html',
    controller:'ProfileEditCtrl',
    resolve:{
      profile:['Users', function (Users) {
        // return Users.getById();
        return null;
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ProfileEditCtrl', ['$scope', '$location', 'profile', 'security', function ($scope, $location, profile, security) {
  $scope.profile = profile;
}]);
