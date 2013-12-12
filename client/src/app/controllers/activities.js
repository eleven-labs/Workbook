angular.module('activities', ['resources.activities', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/activities', {
    templateUrl:'templates/activities/list.tpl.html',
    controller:'ActivitiesViewCtrl',
    resolve:{
      activities:['Activities', function (Activities) {
        //TODO: fetch only for the current user
        return Activities.all();
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ActivitiesViewCtrl', ['$scope', '$location', 'activities', 'security', function ($scope, $location, activities, security) {
  $scope.activities = activities;

  // $scope.viewProject = function (project) {
  //   $location.path('/activities/'+project.$id());
  // };
}]);
