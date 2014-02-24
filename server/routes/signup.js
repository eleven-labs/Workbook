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
  app.post('/signup/validation', function(req, res, next) {
    if (req.isAuthenticated()) return res.json(401, { error: 'User must be logged out' });
    return User.accountValidator(req.body.key, function(err, user) {
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
};
