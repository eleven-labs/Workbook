describe('ProfileEditCtrl', function() {

  beforeEach(module('profile'));

  var dummyUser = { _id: 'user-id' };

  function runController($scope) {
    inject(function($controller, security) {
      security.currentUser = dummyUser;
      $controller('ProfileEditCtrl', { $scope: $scope });
    });
  }

  function createMockUser(id, text) {
    var user = {
      _id: id,
      text: text
    };

    user.$id = function() { return user._id; };
    user.$update = function(success) {
      success();
    };

    return user;
  }

  it("attaches the current user to the scope", function() {
    var $scope = {};

    runController($scope);
    expect($scope.user).toBe(dummyUser);
  });
});