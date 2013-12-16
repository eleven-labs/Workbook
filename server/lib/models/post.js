var mongoose = require('mongoose');
var moment = require('moment');
var pwd = require('pwd');
var config = require('../../config.js');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  image:     String,
  text:      { type: String, min: 1, max: 2000 },
  creator:   { type: Schema.ObjectId, ref: 'User', required: true, index: true }
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
