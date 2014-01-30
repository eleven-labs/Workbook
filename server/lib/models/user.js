var mongoose           = require('mongoose');
var mongooseUserPlugin = require('mongoose-user-plugin');
var config             = require('../../config.js');

var status = [ 'leader', 'human-resource', 'consultant' ];

var UserSchema = new mongoose.Schema();
UserSchema.plugin(MongooseUserPlugin, { emailMatch: /@eleven-labs.com/ });

var UserSchema.add({
  admin:                  { type: Boolean, 'default': false },
  status:                 { type: String,  'default': false, enum: status }
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
