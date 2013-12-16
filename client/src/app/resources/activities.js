angular.module('resources.activities', ['resourceFactory']);
angular.module('resources.activities').factory('Activities', ['resourceFactory', function ($resourceFactory) {

  var Activities = $resourceFactory('activities');

  return Activities;
}]);
