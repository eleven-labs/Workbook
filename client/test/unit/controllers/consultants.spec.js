describe('ConsultantsListViewCtrl', function() {

  beforeEach(module('consultants'));

  function runController($scope, consultants) {
    inject(function($controller) {
      $controller('ConsultantsListViewCtrl', { $scope: $scope, consultants: consultants });
    });
  }

  function createMockUser(id) {
    return {
      $id:                         function() { return id; },
      email:                       'dummy email',
      lastName:                    'dummy last name',
      firstName:                   'dummy first name',
      missionAddress:              'dummy mission address',
      technologies:                'dummy technologies'
    };
  }

  function createMockUserList() {
    return [ createMockUser('consultant-id') ];
  }

  it("attaches the list of consultants to the scope", function() {
    var $scope = {},
        consultants = createMockUserList();

    runController($scope, consultants);
    expect($scope.consultants).toBe(consultants);
  });
});