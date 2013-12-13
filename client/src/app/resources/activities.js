angular.module('resources.activities', ['mongolabResource']);
angular.module('resources.activities').factory('Activities', ['mongolabResource', function ($mongolabResource) {

  var Activities = $mongolabResource('activities');

  Activities.forUser = function(userId, successcb, errorcb) {
    //TODO: get activities for this user only (!)
    return Activities.query({}, successcb, errorcb);
  };

  Activities.prototype.isProductOwner = function (userId) {
    return this.productOwner === userId;
  };
  Activities.prototype.canActAsProductOwner = function (userId) {
    return !this.isScrumMaster(userId) && !this.isDevTeamMember(userId);
  };
  Activities.prototype.isScrumMaster = function (userId) {
    return this.scrumMaster === userId;
  };
  Activities.prototype.canActAsScrumMaster = function (userId) {
    return !this.isProductOwner(userId);
  };
  Activities.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };
  Activities.prototype.canActAsDevTeamMember = function (userId) {
    return !this.isProductOwner(userId);
  };

  Activities.prototype.getRoles = function (userId) {
    var roles = [];
    if (this.isProductOwner(userId)) {
      roles.push('PO');
    } else {
      if (this.isScrumMaster(userId)){
        roles.push('SM');
      }
      if (this.isDevTeamMember(userId)){
        roles.push('DEV');
      }
    }
    return roles;
  };

  return Activities;
}]);
