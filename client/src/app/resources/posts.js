angular.module('resources.posts', ['resourceFactory']);
angular.module('resources.posts').factory('Posts', ['resourceFactory', function ($resourceFactory) {

  var Posts = $resourceFactory('posts');

  return Posts;
}]);
