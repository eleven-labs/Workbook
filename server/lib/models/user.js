var mongoose = require('mongoose');
var moment = require('moment');
var pwd = require('pwd');
var config = require('../../config.js');
var Schema = mongoose.Schema;

var status = [ 'leader', 'human-resource', 'consultant' ];

var UserSchema = new Schema({
  firstName:              String,
  lastName:               String,
  email:                  { type: String, required: true, unique: true, match: /@/ },
  salt:                   { type: String },
  picture:                String,
  password:               String,
  language:               { type: String, required: true, "enum": config.languages },
  validated:              { type: Boolean, "default": false },
  validationKey:          { type: String },
  facebook:               { id: String, name: String },
  twitter:                { id: String, name: String },
  regeneratePasswordKey:  String,
  regeneratePasswordDate: Date,
  admin:                  { type: Boolean, 'default': false },
  status:                 { type: String,  'default': false, enum: status }
});

/*
Statics
*/

UserSchema.statics.signup = function(email, password, language, done) {
  var self;
  self = this;
  return self.findOne({
    email: email
  }, function(err, user) {
    var newUser;
    if (err) {
      return done(err);
    }
    if (!!user) {
      return done(new Error("Email already exists."), null);
    }
    newUser = new self({
      email: email,
      language: language
    });
    return newUser.updatePassword(password, function(err) {
      if (err) {
        return done(err);
      }
      return newUser.generateRandomKey(function(err, key) {
        newUser.validationKey = key;
        return newUser.save(done);
      });
    });
  });
};

UserSchema.statics.accountValidator = function(validationKey, done) {
  return this.findOne({
    validationKey: validationKey
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(new Error("No account found."), null);
    }
    user.validated = true;
    user.validationKey = null;
    return user.save(done);
  });
};

UserSchema.statics.isValidUserPassword = function(email, password, done) {
  return this.findOne({
    email: email
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: "Incorrect email."
      });
    }
    if (user.validated !== true) {
      return done(null, false, {
        message: "Account not validated."
      });
    }
    if (password === user.password) {
      return done(null, user);
    }
    return done(null, false, {
      message: "Incorrect password."
    });
  });
};

UserSchema.statics.findOrCreateFaceBookUser = function(profile, done) {
  var self;
  self = this;
  return this.findOne({
    'facebook.id': profile.id
  }, function(err, user) {
    if (user) {
      return done(null, user);
    } else {
      return new self({
        email: profile.emails[0].value,
        language: profile.language,
        validated: true,
        facebook: {
          id: profile.id,
          name: profile.displayName
        }
      }).save(done);
    }
  });
};

UserSchema.statics.isPasswordComplexEnough = function(password) {
  if (!password || password.length < 3) {
    return false;
  }
  return true;
};

/*
Methods
*/

UserSchema.methods.generateRandomKey = function(callback) {
  return pwd.hash(this.salt, function(err, salt, hash) {
    if (err) {
      return callback(err);
    }
    return callback(null, salt.match(/([0-9a-z])/ig).slice(0, 50).join(''));
  });
};

UserSchema.methods.requestResetPassword = function(callback) {
  var self;
  self = this;
  return this.generateRandomKey(function(err, key) {
    if (err) {
      callback(err);
    }
    self.regeneratePasswordKey = key;
    self.regeneratePasswordDate = moment();
    return self.save(function(err) {
      if (err) {
        callback(err);
      }
      return callback(null, self);
    });
  });
};

UserSchema.methods.updatePassword = function(password, done) {
  var self;
  self = this;
  return pwd.hash(password, function(err, salt, hash) {
    if (err) {
      throw err;
    }
    self.salt = salt;
    self.passwordHash = hash;
    self.regeneratePasswordKey = null;
    self.regeneratePasswordDate = null;
    return self.save(done);
  });
};

UserSchema.methods.getName = function() {
  if (!this.firstName || !this.firstName) {
    return this.email;
  }
  return this.firstName + ' ' + this.lastName;
};

UserSchema.methods.isValidated = function() {
  return this.validated === true;
};

var User = mongoose.model("User", UserSchema);

module.exports = User;
