angular.module('posts', ['resources.posts', 'security.authorization', 'ngSanitize'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/posts', {
    templateUrl:'templates/posts/list.tpl.html',
    controller:'PostsViewCtrl',
    resolve:{
      posts:['Posts', function (Posts) {
        return Posts.getList(10, 4);
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('PostsViewCtrl', ['$scope', 'posts', 'security', 'Posts', function ($scope, posts, security, Posts) {
  $scope.posts = posts;

  $scope.post = null;
  $scope.text = '';
  $scope.allPostsDisplayed = false;

  $scope.editingPost = function() {
    return $scope.post !== null;
  }

  $scope.isNewPost = function() {
    return $scope.editingPost() && !$scope.post.$id();
  }

  var getAllSuccess = function(posts, status, headers, config) {
    $scope.posts = posts;
  };

  var saveSuccess = function(result, status, headers, config) {
    $scope.posts.unshift(result);
    $scope.text = '';
    $scope.post = null;
  };

  var updateSuccess = function(result, status, headers, config) {
    $scope.post = null;
  };

  var failsRequest = function(result, status, headers, config) {
    console.log('error');
  };

  $scope.initNewPost = function() {
    $scope.post = new Posts();
    $scope.text = '';
  }

  $scope.savePost = function() {
    $scope.post.text = $scope.text;
    if ($scope.post.$id()) {
      return $scope.post.$update(updateSuccess, failsRequest);
    } else {
      return $scope.post.$save(saveSuccess, failsRequest);
    }
  };

  $scope.editPost = function(post) {
    $scope.post = post;
    $scope.text = post.text;
  };

  $scope.removePost = function(postToRemove) {
    postToRemove.$remove(
      function removeSuccess(){
        $scope.posts = $scope.posts.filter(function removePost(post){
          return post.$id() !== postToRemove.$id();
        })
      },
      failsRequest
    );
  };

  $scope.getOlderPosts = function() {
    var olderPostDisplayed = $scope.posts[$scope.posts.length - 1];
    var numOlderPostsRequired = 10;

    olderPostDisplayed.$getOlderPosts(
      numOlderPostsRequired,
      4,
      function successRequest(olderPosts, status, headers, config) {
        var numOlderPosts = Object.keys(olderPosts).length;
        if (numOlderPosts < numOlderPostsRequired) {
          $scope.allPostsDisplayed = true;
        }
        for (var i = 0; i < numOlderPosts - 1; i++) {
          $scope.posts.push(new Posts(olderPosts[i]));
        }
      },
      failsRequest
    );
  };
}])

.directive('post', function() {
  return {
    restrict: 'E',
    scope: {
      post: '=',
      'editPost': '&onPostEdit',
      'removePost': '&onPostRemove'
    },
    templateUrl: 'templates/posts/post.tpl.html',
    controller: function($scope, security) {
      var updateSuccess = function(result, status, headers, config) {
        $scope.post = result;
      };

      var failsRequest = function(result, status, headers, config) {
        console.log('error');
      };

      $scope.focusPostCommentArea = function($event) {
        $($event.currentTarget).closest('.media-body').find('.form-control').focus();
      };

      $scope.userInArray = function(userIds) {
        return userIds.indexOf(security.currentUser.id) !== -1;
      }

      $scope.like = function(post) {
        post.$addLike(updateSuccess, failsRequest);
      };

      $scope.unlike = function(post) {
        post.$removeLike(updateSuccess, failsRequest);
      };

      $scope.ownPost = function(post) {
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
            failsRequest
          );
        }
      };

      $scope.removeComment = function(post, comment) {
        post.$removeComment(comment._id, updateSuccess, failsRequest);
      };

      $scope.displayPreviousComments = function() {
        $scope.post.$getPreviousComments(
          $scope.post.comments.length,
          10,
          function successRequest(lastComments, status, headers, config) {
            for (var i = Object.keys(lastComments).length - 1; i >= 0; i--) {
              $scope.post.comments.unshift(lastComments[i]);
            }
          },
          failsRequest
        );
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

      $scope.ownComment = function(comment) {
        return comment.creator == security.currentUser.id;
      }
    }
  };
});
