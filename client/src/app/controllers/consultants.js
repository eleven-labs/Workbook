angular.module('consultants', ['services.crud', 'resources.users', 'security.authorization'])

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

.controller('ConsultantsListViewCtrl', ['$scope', 'crudListMethods', '$location', 'consultants', 'security', function ($scope, crudListMethods, $location, consultants, security) {
  $scope.consultants = consultants;

  angular.extend($scope, crudListMethods('/admin/users'));

  // $scope.viewProject = function (consultant) {
  //   $location.path('/consultants/'+consultant.$id());
  // };
}])

.controller('ConsultantsMappingViewCtrl', ['$scope', '$location', 'consultants', 'security', function ($scope, $location, consultants, security) {
  $scope.consultants = consultants;

  // $scope.viewProject = function (consultant) {
  //   $location.path('/consultants/'+consultant.$id());
  // };
}]);
