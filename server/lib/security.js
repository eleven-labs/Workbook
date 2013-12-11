var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var app = express();

var filterUser = function(user) {
  if ( user ) {
    return {
      user : {
        id: user._id.$oid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin
      }
    };
  } else {
    return { user: null };
  }
};

var security = {
  initialize: function(dbName, authCollection) {
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function(email, password, done){
      User.isValidUserPassword(email, password, done);
    }));

    passport.serializeUser(function(user, done) {
      return done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      return User.findById(id, function(err, user) {
        if (err) {
          done(err);
        }
        return done(null, user);
      });
    });

  },
  authenticationRequired: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  adminRequired: function(req, res, next) {
    if (req.user && req.user.admin ) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  sendCurrentUser: function(req, res, next) {
    res.json(200, filterUser(req.user));
    res.end();
  },
  login: function(req, res, next) {
    function authenticationFailed(err, user, info){
      if (err) { return next(err); }
      if (!user) { return res.json(filterUser(user)); }
      req.logIn(user, function(err) {
        if ( err ) { return next(err); }
        return res.json(filterUser(user));
      });
    }
    return passport.authenticate('local', authenticationFailed)(req, res, next);
  },
  logout: function(req, res, next) {
    req.logout();
    res.send(204);
  }
};

module.exports = security;
