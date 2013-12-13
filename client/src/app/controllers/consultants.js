angular.module('consultants', ['resources.consultants', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider
    .when('/consultants-list', {
      templateUrl:'templates/consultants/list.tpl.html',
      controller:'ConsultantsListViewCtrl',
      resolve:{
        consultants:['Consultants', function (Consultants) {
          return Consultants.all();
        }],
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    })
    .when('/consultants-mapping', {
      templateUrl:'templates/consultants/mapping.tpl.html',
      controller:'ConsultantsMappingViewCtrl',
      resolve:{
        consultants:['Consultants', function (Consultants) {
          return Consultants.all();
        }],
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    });
}])

.controller('ConsultantsListViewCtrl', ['$scope', '$location', 'consultants', 'security', function ($scope, $location, consultants, security) {
  $scope.consultants = consultants;

  // $scope.viewProject = function (project) {
  //   $location.path('/consultants/'+project.$id());
  // };
}])

.controller('ConsultantsMappingViewCtrl', ['$scope', '$location', 'consultants', 'security', function ($scope, $location, consultants, security) {
  $scope.consultants = consultants;

  // $scope.viewProject = function (project) {
  //   $location.path('/consultants/'+project.$id());
  // };
}]);
