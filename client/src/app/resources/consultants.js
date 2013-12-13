angular.module('resources.consultants', ['mongolabResource']);
angular.module('resources.consultants').factory('Consultants', ['mongolabResource', function ($mongolabResource) {

  var Consultants = $mongolabResource('consultants');

  Consultants.forUser = function(userId, successcb, errorcb) {
    //TODO: get consultants for this user only (!)
    return Consultants.query({}, successcb, errorcb);
  };

  Consultants.prototype.isProductOwner = function (userId) {
    return this.productOwner === userId;
  };
  Consultants.prototype.canActAsProductOwner = function (userId) {
    return !this.isScrumMaster(userId) && !this.isDevTeamMember(userId);
  };
  Consultants.prototype.isScrumMaster = function (userId) {
    return this.scrumMaster === userId;
  };
  Consultants.prototype.canActAsScrumMaster = function (userId) {
    return !this.isProductOwner(userId);
  };
  Consultants.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };
  Consultants.prototype.canActAsDevTeamMember = function (userId) {
    return !this.isProductOwner(userId);
  };

  Consultants.prototype.getRoles = function (userId) {
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

  return Consultants;
}]);
