angular.module('resources.users', ['resourceFactory']);
angular.module('resources.users').factory('Users', ['resourceFactory', function ($resourceFactory) {

  var userResource = $resourceFactory('users');

  userResource.allConsultants = function (cb, errorcb) {
      return this.all(cb, errorcb);
    };

  userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };

  return userResource;
}]);
