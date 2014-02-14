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

  $scope.posts = [
    {
      text: 'Je suis post',
      likes: [ 'dsf4ds654f55sddf4d4s', 'fds54f65sd465f465sd4f' ],
      creator: { email: 'test@eleven-labs.com' },
      comments: [
        {
          creator: { email: 'test1@eleven-labs.com' },
          message: 'Je suis une message qui dit plop !',
          likes: [ 'dsf4ds654f55sddf4d4s', 'fds54f65sd465f465sd4f', 'fds4f654sd4f6q4dsf64' ]
        },
        {
          creator: { email: 'test2@eleven-labs.com' },
          message: 'Je suis une message qui dit plip !',
          likes: [ 'dsf4ds654f55sddf4d4s' ]
        },
        {
          creator: { email: 'test3@eleven-labs.com' },
          message: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.',
          likes: [ 'dsf4ds654f55sddf4d4s' ]
        }
      ]
    },
    {
      text: 'Je suis un autre post',
      comments: [
        {
          creator: { email: 'test4@eleven-labs.com' },
          message: 'Je suis une message qui dit plup !',
          likes: []
        }
      ]
    }
  ];

  $scope.focusPostCommentArea = function(){
    angular.element(".comment-area").focus();
  };

  // $scope.viewProject = function (post) {
  //   $location.path('/posts/'+post.$id());
  // };
}]);
