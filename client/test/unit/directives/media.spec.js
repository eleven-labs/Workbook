describe('directives.media', function () {
  var $scope, element;

  function createMockComment(id, message, likes) {
    return {
      _id: id,
      message: message,
      likes: likes
    };
  }

  function createMockMedia(id, text, likes, comments) {
    var media = {
      _id: id,
      text: text,
      likes: likes,
      comments: comments
    };

    media.$id = function() { return media._id; };

    return media;
  }

  beforeEach(module('templates.app'));
  beforeEach(module('directives.media'));

  describe('media', function () {
    beforeEach(inject(function($rootScope, $compile, security) {
      $scope = $rootScope;
      element = $compile('<media media="media" delete-label="Supprimer le media"></media>')($scope);
      security.currentUser = { _id: 'user-id' };
    }));

    it('create a media component', function() {
      $scope.media = createMockMedia('media-id', 'dummy text', [], []);
      $scope.$digest();
      // check buttons presence
      expect(element.find('button').length).toBe(6);
      expect(element.find('button[ng-click="removeMedia(media)"]').length).toBe(1);
      expect(element.find('button[ng-click="like()"]').length).toBe(1);
      expect(element.find('button[ng-click="unlike()"]').length).toBe(1);
      expect(element.find('button[ng-click="focusMediaCommentArea($event)"]').length).toBe(1);
      expect(element.find('button[ng-click="editMedia(media)"]').length).toBe(1);
      expect(element.find('button[ng-click="displayPreviousComments()"]').length).toBe(1);
      // comment elements presences
      expect(element.find('.media.comment').length).toBe(1);
      expect(element.find('.media.comment .media-body').length).toBe(1);
      expect(element.find('.media.comment form[ng-submit="comment()"]').length).toBe(1);
      expect(element.find('.media.comment input[type="submit"]').length).toBe(1);
      // check gravatars presence
      expect(element.find('gravatar').length).toBe(2);
      // no comments
      expect(element.find('comment').length).toBe(0);
      // no one like
      expect(element.find('.media-num-likes').text().trim()).toBe('0');
    });
  
    it('display comments and count likes when existing', function() {
      $scope.media = createMockMedia(
        'media-id',
        'dummy text',
        ['user-dummy-id-1', 'user-dummy-id-2'],
        [createMockComment('comment-id', 'dummy message', [])]
      );
      $scope.$digest();
      expect(element.find('comment').length).toBe(1);
      expect(element.find('.media-num-likes').length).toBe(1);
      expect(element.find('.media-num-likes').text().trim()).toBe('2');
    });

    describe('like', function () {
      it('increment one like', function() {
        $scope.media = createMockMedia('media-id', 'dummy text', [], []);
        $scope.media.$addLike = function(success) {
          success(createMockMedia('media-id', 'dummy text', ['user-dummy-id'], []));
        };
        $scope.$digest();

        expect(element.find('.media-num-likes').text().trim()).toBe('0');

        element.find('button[ng-click="like()"]').click();

        expect(element.find('.media-num-likes').text().trim()).toBe('1');
      });
    });

    describe('unlike', function () {
      it('unincrement one like', function() {
        $scope.media = createMockMedia('media-id', 'dummy text', ['user-dummy-id'], []);
        $scope.media.$removeLike = function(success) {
          success(createMockMedia('media-id', 'dummy text', [], []));
        };
        $scope.$digest();

        expect(element.find('.media-num-likes').text().trim()).toBe('1');

        element.find('button[ng-click="unlike()"]').click();

        expect(element.find('.media-num-likes').text().trim()).toBe('0');
      });
    });

    describe('comment', function () {
      it('insert a comment', function() {
        $scope.media = createMockMedia('media-id', 'dummy text', [], []);
        $scope.media.$addComment = function(message, success) {
          success(createMockMedia('media-id', 'dummy text', [], [createMockComment('comment-id', message, [])]));
        };
        $scope.$digest();

        expect(element.find('comment').length).toBe(0);

        element.find('.media.comment input[name="message"]').val('dummy message');
        element.find('.media.comment input[name="message"]').trigger('input');
        element.find('.media.comment form[ng-submit="comment()"] input[type="submit"]').click();

        expect(element.find('comment').length).toBe(1);
      });
    });

    describe('removeComment', function () {
      it('remove a comment', function() {
        var comment = createMockComment('comment-id', 'dummy message', []);
        $scope.media = createMockMedia('media-id', 'dummy text', [], [comment]);
        $scope.media.$removeComment = function(commentId, success) {
          success(createMockMedia('media-id', 'dummy text', [], []));
        };
        $scope.$digest();

        expect(element.find('comment').length).toBe(1);
        expect(element.find('comment button[ng-click="removeComment(comment)"]').length).toBe(1);

        element.find('comment button[ng-click="removeComment(comment)"]').click();

        expect(element.find('comment').length).toBe(0);
      });
    });

    describe('displayPreviousComments', function () {
      it('display previous comments before displayed comments', function() {
        var comment = createMockComment('comment-id-2', 'dummy message 2', []);
        $scope.media = createMockMedia('media-id', 'dummy text', [], [comment]);
        $scope.media.$getPreviousComments = function(numComments, maxNumLast, success) {
          success({0: createMockComment('comment-id-1', 'dummy message 1', [])});
        };
        $scope.$digest();

        expect(element.find('comment').length).toBe(1);

        expect(element.find('button[ng-click="displayPreviousComments()"]').length).toBe(1);
        element.find('button[ng-click="displayPreviousComments()"]').click();

        expect(element.find('comment').length).toBe(2);
        expect(element.find('comment:eq(0) .media-body').text()).toMatch(/dummy message 1/);
        expect(element.find('comment:eq(1) .media-body').text()).toMatch(/dummy message 2/);
      });
    });
  });

  describe('comment', function () {
    beforeEach(inject(function($rootScope, $compile, security) {
      $scope = $rootScope;
      element = $compile('<comment comment="comment" media="media" on-comment-remove="removeComment(comment)"></comment>')($scope);
      security.currentUser = { _id: 'user-id' };
    }));

    it('create a comment', function(){
      var comment = createMockComment('comment-id', 'dummy message', []);
      $scope.media = createMockMedia('media-id', 'dummy text', [], [comment]);
      $scope.comment = comment;
      $scope.$digest();

      // check buttons presence
      expect(element.find('button').length).toBe(3);
      expect(element.find('button[ng-click="likeComment()"]').length).toBe(1);
      expect(element.find('button[ng-click="unlikeComment()"]').length).toBe(1);
      expect(element.find('button[ng-click="removeComment(comment)"]').length).toBe(1);
      // check gravatars presence
      expect(element.find('gravatar').length).toBe(1);
      // no one like
      expect(element.find('.comment-num-likes').length).toBe(1);
      expect(element.find('.comment-num-likes:eq(0)').text().trim()).toBe('0');
    });

    it('display count likes when existing', function() {
      var comment = createMockComment('comment-id', 'dummy message', ['user-dummy-id-1', 'user-dummy-id-2']);
      $scope.media = createMockMedia('media-id', 'dummy text', [], [comment]);
      $scope.comment = comment;
      $scope.$digest();

      expect(element.find('.comment-num-likes').length).toBe(1);
      expect(element.find('.comment-num-likes').text().trim()).toBe('2');
    });

    describe('likeComment', function(){
      it('add like to the comment', function() {
        var comment = createMockComment('comment-id', 'dummy message', []);
        $scope.media = createMockMedia('media-id', 'dummy text', [], [comment]);
        $scope.comment = comment;
        $scope.media.$addLikeToComment = function(commentId, success) {
          var likedComment = createMockComment('comment-id', 'dummy message', ['user-dummy-id']);
          success(createMockMedia('media-id', 'dummy text', [], [likedComment]));
        };
        $scope.media.$getComment = function(commentId, success) {
          success(createMockComment('comment-id', 'dummy message', ['user-dummy-id']));
        };
        $scope.$digest();

        expect(element.find('.comment-num-likes').length).toBe(0);

        element.find('button[ng-click="likeComment()"]').click();

        expect(element.find('.comment-num-likes').length).toBe(1);
      });
    });
  });
});
