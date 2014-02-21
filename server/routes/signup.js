var config = require('config');
var Mailer = require('node-service-mailer');

var User   = require('../models/user');

var mailer       = new Mailer("Sendmail", require('path').join(__dirname, '../templates/emails/'));
var emailNoReply = config.mailer.sender['no-reply'];

exports.addRoutes = function(app) {
  app.post('/signup', function(req, res, next) {
    return User.signup(req.body.email, req.body.password, 'fr', function(err, user) {
      if (err) return res.json(400, { error: err.message });

      var subject = "Merci de valider ton compte";
      var from    = emailNoReply;
      var to      = user.email;
      var params  = {
        url: 'http://' + req.host + '/signup/validation?key=' + user.validationKey
      };
      return mailer.sendMail('fr', "signup", subject, from, to, params, function(err, response) {
        if (err) return next(err);
        return res.send(200);
      });
    });
  });
  app.get('/signup/validation', function(req, res, next) {
    if (req.isAuthenticated()) return res.json(401, { error: 'User must be logged out' });
    return User.accountValidator(req.query.key, function(err, user) {
      if (err)   return res.json(500, { error: err });
      if (!user) return res.json(400, { error: 'No user found' });

      var subject  = "Bienvenue sur Workbook !";
      var from     = emailNoReply;
      var to       = user.email;
      return mailer.sendMail('fr', "accountValidated", subject, from, to, function(err, response) {
        if (err) return res.json(500, { error: err });
        return res.send(200);
      });
    });
  });
  app.post('/request/reset/password', function(req, res, next) {
    return User.findOne({ email: req.body.email }, function(err, user) {
      if (err)   return res.json(500, { error: err });
      if (!user) return res.json(400, { error: 'No user found' });

      return user.requestResetPassword(function(err, user) {
        if (err) return res.json(500, { error: err });

        var subject  = "Reset your password";
        var from     = emailNoReply;
        var to       = user.email;
        var params   = {
          url: 'http://' + req.host + '/reset/password?key=' + user.regeneratePasswordKey;
        };
        return mailer.sendMail('fr', "requestForResetingPassword", subject, from, to, params, function(err, response) {
          if (err) return next(err);
          return res.send(200);
        });
      });
    });
  });
  app.post('/reset/password', function(req, res, next) {
    if (req.isAuthenticated()) return res.json(401, { error: 'User must be logged out' });
    return User.findOne({ regeneratePasswordKey: req.body.regeneratePasswordKey }, function(err, user) {
      if (err)                 return res.json(500, { error: err });
      if (!user)               return res.json(400, { error: 'No user found' });
      if (!user.isValidated()) return res.json(400, { error: 'User account not validated' });
      if (!req.body.password)  return res.json(400, { error: 'You must provide a password'});
      if (!User.isPasswordComplexEnough(req.body.password)) {
        return res.json(400, { error: 'Password is not enough complex' });
      }

      return user.updatePassword(req.body.password, function(err) {
        if (err) return res.json(500, { error: err });

        var subject  = "Your password has been reseted";
        var from     = emailNoReply;
        var to       = user.email;
        var params = {
          url: 'http://' + req.host + '/request/reset/password',
          email: user.email
        };
        return mailer.sendMail('fr', "passwordReseted", subject, from, to, params, function(err, response) {
          if (err) return res.json(500, { error: err });
          return res.send(200);
        });
      });
    });
  });
};
