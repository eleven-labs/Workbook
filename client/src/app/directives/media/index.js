angular.module('directives.media', ['security.authorization', 'ngSanitize'])

.directive('media', function() {
  return {
    restrict: 'E',
    scope: {
      media: '=',
      'deleteLabel': '@',
      'editMedia': '&onMediaEdit',
      'removeMedia': '&onMediaRemove'
    },
    templateUrl: 'directives/media/templates/media.tpl.html',
    controller: function($scope, security) {
      var updateSuccess = function(result) {
        $scope.media = result;
      };

      var failsRequest = function() {
        console.log('error');
      };

      $scope.focusMediaCommentArea = function($event) {
        $($event.currentTarget).closest('.media-body').find('.form-control').focus();
      };

      $scope.userInArray = function(userIds) {
        return userIds.indexOf(security.currentUser._id) !== -1;
      }

      $scope.like = function() {
        $scope.media.$addLike(updateSuccess, failsRequest);
      };

      $scope.unlike = function() {
        $scope.media.$removeLike(updateSuccess, failsRequest);
      };

      $scope.ownMedia = function() {
        return $scope.media.creator == security.currentUser._id;
      }

      $scope.comment = function() {
        if ($scope.message) {
          $scope.media.$addComment(
            $scope.message,
            function success(result) {
              $scope.message = '';
              updateSuccess(result);
            },
            failsRequest
          );
        }
      };

      $scope.removeComment = function(comment) {
        $scope.media.$removeComment(comment._id, updateSuccess, failsRequest);
      };

      $scope.displayPreviousComments = function() {
        $scope.media.$getPreviousComments(
          $scope.media.comments.length,
          10,
          function successRequest(lastComments) {
            for (var i = Object.keys(lastComments).length - 1; i >= 0; i--) {
              $scope.media.comments.unshift(lastComments[i]);
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
      media: '=',
      comment: '=',
      'removeComment': '&onCommentRemove'
    },
    templateUrl: 'directives/media/templates/comment.tpl.html',
    controller: function($scope, security) {
      var updateSuccess = function(commentId) {
        return function(mediaData) {
          $scope.media.$getComment(
            commentId,
            function success(comment) {
              $scope.comment = comment;
              $scope.media    = mediaData;
            },
            function error(result) {
              console.log(result);
            }
          );
        };
      };

      var updateError = function() {
        console.log('error');
      };

      $scope.userInArray = function(userIds) {
        if (userIds) {
          return userIds.indexOf(security.currentUser._id) !== -1;
        }
      }

      $scope.likeComment = function() {
        $scope.media.$addLikeToComment($scope.comment._id, updateSuccess($scope.comment._id), updateError);
      };

      $scope.unlikeComment = function() {
        $scope.media.$removeLikeFromComment($scope.comment._id, updateSuccess($scope.comment._id), updateError);
      };

      $scope.ownComment = function() {
        return $scope.comment.creator == security.currentUser._id;
      }
    }
  };
});
