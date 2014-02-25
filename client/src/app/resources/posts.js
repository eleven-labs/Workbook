angular.module('resources.posts', ['resourceFactory']);
angular.module('resources.posts').factory('Posts', ['resourceFactory', '$http', function ($resourceFactory, $http) {

  var Posts = $resourceFactory('posts');

  Posts.prototype.$addComment = function (message, successcb, errorcb) {
    var params = { message : message };
    var httpPromise = $http.post(Posts.url + '/' + this.$id() + '/comment', params);
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  Posts.prototype.$getComment = function (commentId, successcb, errorcb) {
    var httpPromise = $http.get(Posts.url + '/' + this.$id() + '/comment/' + commentId);
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  Posts.prototype.$removeComment = function (commentId, successcb, errorcb) {
    var httpPromise = $http.delete(Posts.url + '/' + this.$id() + '/comment/' + commentId + '/remove');
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  Posts.prototype.$addLike = function (successcb, errorcb) {
    var httpPromise = $http.post(Posts.url + '/' + this.$id() + '/like');
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  Posts.prototype.$removeLike = function (successcb, errorcb) {
    var httpPromise = $http.post(Posts.url + '/' + this.$id() + '/unlike');
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  Posts.prototype.$addLikeToComment = function (commentId, successcb, errorcb) {
    var httpPromise = $http.post(Posts.url + '/' + this.$id() + '/comment/' + commentId + '/like');
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  Posts.prototype.$removeLikeFromComment = function (commentId, successcb, errorcb) {
    var httpPromise = $http.post(Posts.url + '/' + this.$id() + '/comment/' + commentId + '/unlike');
    return Posts.thenFactoryMethod(httpPromise, successcb, errorcb);
  };

  return Posts;
}]);
