var config = require('config');
var Mailer = require('node-service-mailer');

var User   = require('../model/user');

var mailer       = new Mailer("Sendmail", require('path').join(__dirname, '../templates/emails/'));
var emailNoReply = config.mailer.sender['no-reply'];

exports.addRoutes = function(app) {
  app.post('/signup', function(req, res, next) {
    var renderWithError;
    renderWithError = function(errorMessage) {
      return res.send('user/signup', { error: errorMessage });
    };
    if (config.signup.captcha && req.isCaptchaValid === false) {
      return renderWithError('Captcha is not correct');
    }
    return User.signup(req.body.email, req.body.password, req.locale, function(err, user) {
      var url;
      if (err) {
        return renderWithError(err.message);
      }
      url = 'http://' + req.host + '/signup/validation?key=' + user.validationKey;
      return mailer.sendMail(req.locale, "signup", "Please validate your account", emailNoReply, user.email, {
        url: url
      }, function(err, response) {
        if (err) {
          return next(err);
        }
        return res.send();
      });
    });
  });
  app.get('/signup/validation', function(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/profile');
    }
    return User.accountValidator(req.query.key, function(err, user) {
      if (err) {
        return res.redirect('/');
      }
      return mailer.sendMail(req.locale, "accountValidated", "Welcome to Super Site !", emailNoReply, user.email, function(err, response) {
        if (err) {
          return next(err);
        }
        return res.redirect('/signupValidation');
      });
    });
  });
  app.post('/request/reset/password', function(req, res, next) {
    return User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render('user/requestForResetingPassword', {
          email: req.body.email,
          warningMessage: 'Email was not found'
        });
      }
      return user.requestResetPassword(function(err, user) {
        var url;
        if (err) {
          return next(err);
        }
        url = 'http://' + req.host + '/reset/password?key=' + user.regeneratePasswordKey;
        return mailer.sendMail(req.locale, "requestForResetingPassword", "Reset your password", emailNoReply, user.email, {
          url: url
        }, function(err, response) {
          if (err) {
            return next(err);
          }
          req.flash('success', 'We\'ve sent to you a email. Check your mail box.');
          return res.redirect('/');
        });
      });
    });
  });
  app.post('/reset/password', function(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/profile');
    }
    return User.findOne({
      regeneratePasswordKey: req.body.regeneratePasswordKey
    }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/');
      }
      if (!user.isValidated()) {
        return res.redirect('/');
      }
      if (!req.body.password) {
        return res.render('user/resetPassword', {
          errorMessage: 'You must provide a password'
        });
      }
      if (!User.isPasswordComplexEnough(req.body.password)) {
        return res.render('user/resetPassword', {
          errorMessage: 'You must provide a password more complicated'
        });
      }
      if (req.body.password) {
        return user.updatePassword(req.body.password, function(err) {
          var recoveringUrl;
          if (err) {
            return next(err);
          }
          recoveringUrl = 'http://' + req.host + '/request/reset/password';
          return mailer.sendMail(req.locale, "passwordReseted", "Your password has been reseted", emailNoReply, user.email, {
            url: recoveringUrl,
            email: user.email
          }, function(err, response) {
            if (err) {
              return next(err);
            }
            req.flash('success', 'Your password has been updated. Please login again.');
            return res.redirect('/login');
          });
        });
      }
    });
  });
};
