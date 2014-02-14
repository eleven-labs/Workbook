var mongoose = require('mongoose');
var MongooseRattlePlugin = require('mongoose-rattle-plugin');

var PostSchema = new mongoose.Schema({
  image:     String,
  text:      { type: String, min: 1, max: 2000 }
});
PostSchema.plugin(MongooseRattlePlugin, {UserShemaName: 'User'});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
