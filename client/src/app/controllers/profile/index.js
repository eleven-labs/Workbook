angular.module('profile', [
  'ngRoute',
  'resources.users',
  'security.authorization'
])

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

  var statusSelection = [
    { key: 'consultant',     label: 'Consultant' },
    { key: 'human-resource', label: 'Ressource humaine' },
    { key: 'leader',         label: 'Dirigeant' }
  ];
  $scope.fields = {
    lastName:                   { key: 'lastName',                   label: 'Last name'                                                },
    firstName:                  { key: 'firstName',                  label: 'First name'                                               },
    addressMission:             { key: 'addressMission',             label: 'Adresse de la mission'                                    },
    technologiesOfPredilection: { key: 'technologiesOfPredilection', label: 'Technologies de predilection'                             },
    status:                     { key: 'status',                     label: 'Status',                      selections: statusSelection }
  }

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
}])

.directive('profileInputText', function(){
  return {
    restrict: 'E',
    scope: {
      info: '=',
      user: '='
    },
    templateUrl: 'controllers/profile/templates/input-text.tpl.html'
  }
})

.directive('profileSelect', function(){
  return {
    restrict: 'E',
    scope: {
      info: '=',
      user: '='
    },
    templateUrl: 'controllers/profile/templates/select.tpl.html'
  }
});
