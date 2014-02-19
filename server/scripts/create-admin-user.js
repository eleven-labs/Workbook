require('../bootstrap');

var winston = require('winston');
var config  = require('config');

var User = require('../lib/models/user');

var userValues = {};
userValues.admin = true;
userValues.language = config.languages[0];
process.argv.forEach(function (val, index, array) {
  match = val.match(/^--(.*?)=(.*)/)
  if (match !== null) {
    userValues[match[1]] = match[2];
  }
});

var logSaveError = function(title, err){
  winston.error(title);
  winston.error(err.message);
  Object.keys(err.errors).forEach(function(errorKey){
    winston.error(errorKey + ': ' + err.errors[errorKey].message);
  });
  winston.error('Please be sure you have set all required properties');
  winston.error('Example: "node scripts/create-admin-user.js --email=dam.saillard@gmail.com --password=plopplop --admin=1 --firstName=Admin --lastName=User');

  process.exit(1);
}

winston.info('Tryring to signup user:', userValues);
User.signup(userValues.email, userValues.password, userValues.language, function(err, userSaved) {
  if (err) return logSaveError('Signup failed', err);
  winston.info('Trying to validate user account');
  User.accountValidator(userSaved.validationKey, function(err, userSaved){
    if (err) return logSaveError('Validation failed', err);
    userSaved.status    = userValues.status;
    userSaved.admin     = userValues.admin;
    userSaved.firstName = userValues.firstName;
    userSaved.lastName  = userValues.lastName;
    winston.info('Trying to set status and admin information for the user');
    userSaved.save(function(err){
      if (err) return logSaveError('Savinf another params failed', err);
      winston.info('User has been created');

      process.exit(1);
    });
  });
});
