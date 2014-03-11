angular.module('consultants', [
  'resources.users',
  'security.authorization'
])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider
    .when('/consultants-list', {
      templateUrl:'templates/consultants/list.tpl.html',
      controller:'ConsultantsListViewCtrl',
      resolve:{
        consultants:['Users', function (Users) {
          return Users.allConsultants();
        }],
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    })
    .when('/consultants-mapping', {
      templateUrl:'templates/consultants/mapping.tpl.html',
      controller:'ConsultantsMappingViewCtrl',
      resolve:{
        consultants:['Users', function (Users) {
          return Users.allConsultants();
        }],
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    });
}])

.controller('ConsultantsListViewCtrl', ['$scope', '$location', 'consultants', 'security', function ($scope, $location, consultants, security) {
  $scope.consultants = consultants;
}])

.controller('ConsultantsMappingViewCtrl', ['$scope', '$location', 'consultants', 'security', function ($scope, $location, consultants, security) {
  $scope.consultants = consultants;
}]);
