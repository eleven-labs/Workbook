describe('PostsViewCtrl', function() {

  beforeEach(module('posts'));

  function runController($scope, posts) {
    inject(function($controller) {
      $controller('PostsViewCtrl', { $scope: $scope, posts: posts });
    });
  }

  function createMockPost(id, text) {
    var post = {
      _id: id,
      text: text
    };

    post.$id = function() { return post._id; };
    post.$update = function(success) {
      success();
    };
    post.$save = function(success) {
      success({0: {_id: 'new-post', text: 'dummy text'}});
    };
    post.$getOlderPosts = function(numPosts, maxNumLastPostComments, success) {
      success({0: {_id: 'W', text: 'dummy text'}, 1: {_id: 'Z', text: 'dummy text'}});
    };
    post.$remove = function(success) {
      success();
    };

    return post;
  }

  function createMockPostList(postsData) {
    var posts = [];
    for (var i in postsData) {
      posts.push(createMockPost(postsData[i]._id, postsData[i].text));
    }
    return posts;
  }

  it("attaches the list of posts to the scope", function() {
    var $scope = {},
        posts = createMockPostList([{_id: 'X', text: 'dummy text'}]);

    runController($scope, posts);
    expect($scope.posts).toBe(posts);
  });

  describe('isEditingPost()', function() {
    var $scope = {};

    it('should check if a post is being currently edited', inject(function() {
      runController($scope, []);

      $scope.post = null;
      expect($scope.isEditingPost()).toEqual(false);

      $scope.post = createMockPost('post-id');
      expect($scope.isEditingPost()).toEqual(true);
    }));
  });

  describe('isEditingNewPost()', function() {
    var $scope = {};

    it('should check if a post is currently being edited and is a new one', inject(function() {
      runController($scope, []);

      $scope.post = {
        $id: function() { return undefined; }
      };
      expect($scope.isEditingNewPost()).toEqual(true);
    }));
  });

  describe('initNewPost()', function() {
    var $scope = {};

    it('init values for a new post', inject(function() {
      runController($scope, []);

      // set value to expect change
      $scope.post = null;
      $scope.text = 'dummy text';

      $scope.initNewPost();

      expect($scope.text).toEqual('');
      expect($scope.post).not.toBeNull();
    }));
  });

  describe('savePost()', function() {
    it('insert post when it is a new one', inject(function() {
      var $scope = {},
        posts = createMockPostList([{_id: 'X', text: 'dummy text'}]);

      runController($scope, posts);

      // new post
      $scope.post = createMockPost(undefined, '');
      $scope.text = 'dummy text changed';

      expect($scope.posts.length).toEqual(1);

      $scope.savePost();

      expect($scope.text).toEqual('');
      expect($scope.post).toBeNull();
      expect($scope.posts.length).toEqual(2);
      expect($scope.posts[1].$id()).toEqual('X');
    }));

    it('update post when it is an existing one', inject(function() {
      var $scope = {},
        posts = createMockPostList([{_id: 'X', text: 'dummy text'}]);

      runController($scope, posts);

      // new post
      $scope.post = posts[0];
      $scope.text = 'dummy text changed';

      expect($scope.posts.length).toEqual(1);

      $scope.savePost();

      expect($scope.text).toEqual('');
      expect($scope.post).toBeNull();
      expect($scope.posts.length).toEqual(1);
      expect($scope.posts[0].$id()).toEqual('X');
      expect($scope.posts[0].text).toEqual('dummy text changed');
    }));
  });

  describe('editPost()', function() {
    it('set edited post to the scope and its text to be modified', function(){
      var $scope = {},
        posts = createMockPostList([{_id: 'X', text: 'dummy text'}]);

      runController($scope, posts);

      $scope.editPost(posts[0]);

      expect($scope.posts[0].$id()).toEqual('X');
      expect($scope.text).toEqual('dummy text');
    });
  });

  describe('removePost()', function() {
    it('removed post from the scope when remote call is successful', function(){
      var $scope = {},
        posts = createMockPostList([{_id: 'X', text: 'dummy text'}, {_id: 'Y', text: 'dummy text'}]);

      runController($scope, posts);

      expect($scope.posts.length).toEqual(2);

      $scope.removePost(posts[0]);

      expect($scope.posts.length).toEqual(1);
      expect($scope.posts[0].$id()).toEqual('Y');
    });
  });

  describe('getOlderPosts()', function() {
    it('append posts in the scope when remote call is successful', function(){
      var $scope = {},
        posts = createMockPostList([{_id: 'X', text: 'dummy text'}, {_id: 'Y', text: 'dummy text'}]);

      runController($scope, posts);

      expect($scope.posts.length).toEqual(2);

      $scope.getOlderPosts(2, 0);

      expect($scope.posts.length).toEqual(4);
      expect($scope.posts[0].$id()).toEqual('X');
      expect($scope.posts[1].$id()).toEqual('Y');
      expect($scope.posts[2].$id()).toEqual('W');
      expect($scope.posts[3].$id()).toEqual('Z');
    });
    it('all posts display condition is going true when older posts number is not as required', function(){
      var $scope = {},
        posts = createMockPostList([{_id: 'X', text: 'dummy text'}, {_id: 'Y', text: 'dummy text'}]);

      runController($scope, posts);

      expect($scope.allPostsDisplayed).toEqual(false);

      $scope.getOlderPosts(3, 0);

      expect($scope.allPostsDisplayed).toEqual(true);
    });
  });
});