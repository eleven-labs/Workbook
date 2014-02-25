angular.module('posts', ['resources.posts', 'security.authorization', 'ngSanitize'])

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

.controller('PostsViewCtrl', ['$scope', 'posts', 'security', 'Posts', function ($scope, posts, security, Posts) {
  $scope.posts = posts;

  var updateSuccess = function(result, status, headers, config) {
    $scope.posts.push(result);
  };

  var updateError = function(result, status, headers, config) {
    console.log('error');
  };

  $scope.addPost = function() {
    if (this.text) {
      new Posts({text: this.text}).$save(updateSuccess, updateError);
      this.text = '';
    }
  };
}])

.directive('post', function() {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    templateUrl: 'templates/posts/post.tpl.html',
    controller: function($scope, security) {
      var updateSuccess = function(result, status, headers, config) {
        $scope.post = result;
      };

      var updateError = function(result, status, headers, config) {
        console.log('error');
      };

      $scope.focusPostCommentArea = function($event) {
        $($event.currentTarget).closest('.media-body').find('.form-control').focus();
      };

      $scope.userInArray = function(userIds) {
        return userIds.indexOf(security.currentUser.id) !== -1;
      }

      $scope.like = function(post) {
        post.$addLike(updateSuccess, updateError);
      };

      $scope.unlike = function(post) {
        post.$removeLike(updateSuccess, updateError);
      };

      $scope.removePost = function(post) {
        post.$remove(updateSuccess, updateError);
      };

      $scope.canRemovePost = function(post) {
        return post.creator == security.currentUser.id;
      }

      $scope.comment = function(post) {
        var self = this;
        if (this.message) {
          post.$addComment(
            this.message,
            function success(result, status, headers, config) {
              self.message = '';
              updateSuccess(result, status, headers, config);
            },
            updateError
          );
        }
      };

      $scope.removeComment = function(post, comment) {
        post.$removeComment(comment._id, updateSuccess, updateError);
      };
    }
  };
})

.directive('comment', function() {
  return {
    restrict: 'E',
    scope: {
      post: '=',
      comment: '=',
      'removeComment': '&onCommentRemove'
    },
    templateUrl: 'templates/posts/comment.tpl.html',
    controller: function($scope, security, Posts) {
      var updateSuccess = function(commentId) {
        return function(post, status, headers, config) {
          $scope.post.$getComment(
            commentId,
            function success(comment, status, headers, config) {
              $scope.comment = comment;
              $scope.post    = post;
            },
            function error(result, status, headers, config) {
              console.log(result);
            }
          );
        };
      };

      var updateError = function(result, status, headers, config) {
        console.log('error');
      };

      $scope.userInArray = function(userIds) {
        if (userIds) {
          return userIds.indexOf(security.currentUser.id) !== -1;
        }
      }

      $scope.likeComment = function(post, comment) {
        post.$addLikeToComment(comment._id, updateSuccess(comment._id), updateError);
      };

      $scope.unlikeComment = function(post, comment) {
        post.$removeLikeFromComment(comment._id, updateSuccess(comment._id), updateError);
      };

      $scope.canRemoveComment = function(comment) {
        return comment.creator == security.currentUser.id;
      }
    }
  };
});
