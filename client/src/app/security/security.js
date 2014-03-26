// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
  'security.retryQueue'    // Keeps track of failed requests that need to be retried once the user logs in
])

.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', function($http, $q, $location, queue, $modal) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      $location.path('/login');
    }
  });

  // The public API of the service
  var service = {

    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },

    signup: function(email, password) {
      return $http.post('/signup', {email: email, password: password});
    },

    signupValidation: function(key) {
      return $http.post('/signup/validation', {key: key});
    },

    requestResetPassword: function(email) {
      return $http.post('/request/reset/password', {email: email});
    },

    resetPassword: function(key, password) {
      return $http.post('/reset/password', {regeneratePasswordKey: key, password: password});
    },

    // Attempt to authenticate a user by the given email and password
    login: function(email, password) {
      var request = $http.post('/login', {email: email, password: password});
      return request.then(function(response) {
        service.currentUser = response.data.user;
        return service.isAuthenticated();
      });
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        service.currentUser = null;
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/current-user').then(function(response) {
          service.currentUser = response.data.user;
          return service.currentUser;
        });
      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },

    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}]);
