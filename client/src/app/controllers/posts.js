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

.controller('PostsViewCtrl', ['$scope', '$location', 'posts', 'security', 'Posts', function ($scope, $location, posts, security, Posts) {
  $scope.posts = posts;

  $scope.focusPostCommentArea = function($event) {
    $($event.currentTarget).closest('.media-body').find('.form-control').focus();
  };

  var updateSuccess = function(result, status, headers, config) {
    Posts.all(
      function success(result, status, headers, config) {
        $scope.posts = result;
      },
      function error(result, status, headers, config) {
        console.log('error');
      }
    );
  };

  var updateError = function(result, status, headers, config) {
    console.log('error');
  }

  $scope.addPost = function() {
    if (this.text) {
      new Posts({text: this.text}).$save(updateSuccess, updateError);
      this.text = '';
    }
  }

  $scope.addComment = function(post) {
    if (this.message) {
      post.$addComment(this.message, updateSuccess, updateError);
    }
  }
}]);
