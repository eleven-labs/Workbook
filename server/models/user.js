var mongoose           = require('mongoose');
var MongooseUserPlugin = require('mongoose-user-plugin');

var status = [ 'leader', 'human-resource', 'consultant' ];

var UserSchema = new mongoose.Schema();
UserSchema.plugin(MongooseUserPlugin, {languages: ['fr', 'en']});

UserSchema.add({
  email:                      { type: String, required: true, unique: true, match: /@eleven-labs.com/ },
  admin:                      { type: Boolean, 'default': false },
  status:                     { type: String,  'default': 'consultant', enum: status },
  addressMission:             { type: String },
  technologiesOfPredilection: { type: String }
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
