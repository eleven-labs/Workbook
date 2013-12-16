angular.module('posts', ['resources.posts', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/posts', {
    templateUrl:'templates/posts/list.tpl.html',
    controller:'PostsViewCtrl',
    resolve:{
      posts:['Posts', function (Posts) {
        return Posts.all();
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('PostsViewCtrl', ['$scope', '$location', 'posts', 'security', function ($scope, $location, posts, security) {
  $scope.posts = posts;

  // $scope.viewProject = function (project) {
  //   $location.path('/posts/'+project.$id());
  // };
}]);
