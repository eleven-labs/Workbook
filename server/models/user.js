var config             = require('config');
var mongoose           = require('mongoose');
var MongooseUserPlugin = require('mongoose-user-plugin');

var status = [ 'leader', 'human-resource', 'consultant' ];

var UserSchema = new mongoose.Schema();
UserSchema.plugin(MongooseUserPlugin, {languages: ['fr', 'en']});

UserSchema.add({
  admin:                      { type: Boolean, 'default': false },
  status:                     { type: String,  'default': 'consultant', enum: status },
  addressMission:             { type: String },
  technologiesOfPredilection: { type: String }
});

if (config.signin.emailDomain !== null) {
    UserSchema.add({email: { type: String, required: true, unique: true, match: new RegExp(config.signin.emailDomain) }})
}

var User = mongoose.model("User", UserSchema);

module.exports = User;
