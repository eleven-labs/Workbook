var mongoose = require('mongoose');
var MongooseRattlePlugin = require('mongoose-rattle-plugin');

var PostSchema = new mongoose.Schema({
  image:     String,
  text:      { type: String, min: 1, max: 2000 }
});
PostSchema.plugin(MongooseRattlePlugin, {UserShemaName: 'User'});

PostSchema.statics.getList = function(numPosts, maxNumLastPostComments, callback) {
  var fields = {
    text: 1,
    creator: 1,
    dateCreation: 1,
    dateUpdate: 1,
    likes: 1,
    comments: { $slice: [-maxNumLastPostComments, maxNumLastPostComments] }
  };
  this.find({}, fields).sort('-dateCreation').limit(numPosts).exec(callback);
}

PostSchema.statics.findByIdAndGetPreviousComments = function(id, numCommentsAlreadyDisplay, maxNumLastPostComments, callback) {
  var self = this;
  this.aggregate({$unwind: "$comments"}, {$group: {_id: '', count: {$sum: 1}}}, function(err, summary){
    var start = -maxNumLastPostComments - numCommentsAlreadyDisplay;
    var limit = maxNumLastPostComments;
    if (summary[0].count < Math.abs(start)) {
      var diff = Math.abs(start) - summary[0].count;
      start += diff;
      limit -= diff;
    }
    var fields = {
      comments: { $slice: [start, limit] }
    };
    self.findById(id, fields).exec(callback);
  });
}

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
