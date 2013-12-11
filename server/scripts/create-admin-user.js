require('../bootstrap');

var winston = require('winston');
var config = require('../config');

var User = require('../lib/models/user');

var userValues = {};
process.argv.forEach(function (val, index, array) {
  match = val.match(/^--(.*?)=(.*)/)
  if (match !== null) {
    userValues[match[1]] = match[2];
  }
});
userValues.admin = true;
userValues.language = config.languages[0];

winston.info('Tryring to insert user:', userValues);
new User(userValues).save(function(err) {
  if (err) {
    winston.error('Creation failed');
    winston.error(err.message);
    Object.keys(err.errors).forEach(function(errorKey){
      winston.error(errorKey + ': ' + err.errors[errorKey].message);
    });
    winston.error('Please be sure you have set all required properties');
    winston.error('Example: "node scripts/create-admin-user.js --email=dam.saillard@gmail.com --password=plopplop --admin=1 --firstName=Admin --lastName=User');
  } else {
    winston.info('User has been created');
  }

  process.exit(1);
});
