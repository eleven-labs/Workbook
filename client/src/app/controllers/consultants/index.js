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

  var elevenCoords = {
    latitude: 48.871476,
    longitude: 2.308413
  };

  $scope.map = {
      center: elevenCoords,
      zoom: 12,
      eleven : {
        title: "Eleven Labs"
      }
  };

  var maxLatDiff  = 0;
  var maxLongDiff = 0;

  _.each(consultants, function(consultant, index) {
    if (!consultant.map) {
      return;
    }

    maxLatDiff  = Math.max(maxLatDiff, Math.abs($scope.map.center.latitude - consultant.map.latitude));
    maxLongDiff = Math.max(maxLongDiff, Math.abs($scope.map.center.longitude - consultant.map.longitude));

    $scope.map.bounds = {
      northeast: {
        latitude: elevenCoords.latitude + maxLatDiff,
        longitude: elevenCoords.longitude + maxLongDiff
      },
      southwest: {
        latitude: elevenCoords.latitude - maxLatDiff,
        longitude: elevenCoords.longitude - maxLongDiff
      }
    };
  });

}]);
