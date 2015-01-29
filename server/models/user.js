var config             = require('config');
var mongoose           = require('mongoose');
var MongooseUserPlugin = require('mongoose-user-plugin');
var https              = require('https');

var status = [ 'leader', 'human-resource', 'consultant' ];

var UserSchema = new mongoose.Schema();
UserSchema.plugin(MongooseUserPlugin, {languages: ['fr', 'en']});

UserSchema.add({
  admin:          { type: Boolean, 'default': false },
  status:         { type: String,  'default': 'consultant', enum: status },
  technologies:   { type: String },
  missionAddress: { type: String },
  map:            {
    latitude:  { type: Number },
    longitude: { type: Number }
  }
});

if (config.signin.emailDomain !== null) {
    UserSchema.add({email: { type: String, required: true, unique: true, match: new RegExp(config.signin.emailDomain) }})
}

var googleGeocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&key=AIzaSyAPP8pToHqfF96uis3EHCoDantTKR483XM';

UserSchema.pre('save', function (next) {
  var self = this;
  var googleGeocodeUrlWithAddress = googleGeocodeUrl + '&address=' + encodeURIComponent(self.missionAddress);

  console.log('User pre save. Call: ' + googleGeocodeUrlWithAddress);

  var req = https.get(googleGeocodeUrlWithAddress, function(res) {
    if (res.statusCode == 200) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        var response = JSON.parse(body)
        if (response && response.results && response.results.length > 0) {
          self.map = {
            latitude  : response.results[0].geometry.location.lat,
            longitude : response.results[0].geometry.location.lng
          };

          next();
        }
      });
    } else {
      console.log('Google geocoder response code: ' + res.statusCode);
    }
  });
  req.end();

  req.on('error', function(e) {
    console.log('problem with Google geocoder request: ' + e.message);
  });
});

UserSchema.methods.toJSON = function() {
  var obj = this.toObject()

  delete obj.passwordHash
  delete obj.salt

  return obj
};

var User = mongoose.model("User", UserSchema);

module.exports = User;
