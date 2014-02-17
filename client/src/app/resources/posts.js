angular.module('resources.posts', ['resourceFactory']);
angular.module('resources.posts').factory('Posts', ['resourceFactory', '$http', function ($resourceFactory, $http) {

  var Posts = $resourceFactory('posts');

  Posts.prototype.$addComment = function (message, successcb, errorcb) {
    var params = { message : message };
    var httpPromise = $http.post(Posts.url + '/' + this.$id() + '/message', params);
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  Posts.prototype.$addLike = function (successcb, errorcb) {
    var httpPromise = $http.post(Posts.url + '/' + this.$id() + '/like');
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  return Posts;
}]);
