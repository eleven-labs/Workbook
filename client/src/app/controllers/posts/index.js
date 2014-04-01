angular.module('posts', [
  'ngRoute',
  'resources.posts',
  'security.authorization',
  'angular.bootstrap.media'
])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/posts', {
    templateUrl:'controllers/posts/templates/list.tpl.html',
    controller:'PostsViewCtrl',
    resolve:{
      posts:['Posts', function (Posts) {
        return Posts.getList(10, 4);
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('PostsViewCtrl', ['$scope', 'posts', 'Posts', 'security', function ($scope, posts, Posts, security) {
  $scope.posts = posts;

  $scope.post = null;
  $scope.text = '';
  $scope.allPostsDisplayed = false;
  $scope.currentUser = security.currentUser;

  $scope.isEditingPost = function() {
    return $scope.post !== null;
  };

  $scope.isEditingNewPost = function() {
    return $scope.isEditingPost() && !$scope.post.$id();
  };

  var saveSuccess = function(result) {
    $scope.posts.unshift(result);
    $scope.text = '';
    $scope.post = null;
  };

  var updateSuccess = function() {
    $scope.text = '';
    $scope.post = null;
  };

  var failsRequest = function() {
    console.log('error');
  };

  $scope.initNewPost = function() {
    $scope.post = new Posts();
    $scope.text = '';
  };

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
        });
      },
      failsRequest
    );
  };

  $scope.getOlderPosts = function(numPosts, maxNumLastPostComments) {
    var olderPostDisplayed = $scope.posts[$scope.posts.length - 1];

    olderPostDisplayed.$getOlderPosts(
      numPosts,
      maxNumLastPostComments,
      function successRequest(olderPosts) {
        var numOlderPosts = Object.keys(olderPosts).length;
        if (numOlderPosts < numPosts) {
          $scope.allPostsDisplayed = true;
        }
        for (var i = 0; i < numOlderPosts; i++) {
          $scope.posts.push(new Posts(olderPosts[i]));
        }
      },
      failsRequest
    );
  };
}]);