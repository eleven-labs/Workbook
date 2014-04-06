angular.module('consultants', [
  'ngRoute',
  'resources.users',
  'security.authorization',
  'google-maps'
])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider
    .when('/consultants-list', {
      templateUrl:'controllers/consultants/templates/list.tpl.html',
      controller:'ConsultantsListViewCtrl',
      resolve:{
        consultants:['Users', function (Users) {
          return Users.allConsultants();
        }],
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    })
    .when('/consultants-mapping', {
      templateUrl:'controllers/consultants/templates/mapping.tpl.html',
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
  $scope.map = {
      center: {
          latitude: 48.871476,
          longitude: 2.308413
      },
      zoom: 14,
      eleven : {
        title: "Eleven Labs"
      }
  };
}]);
