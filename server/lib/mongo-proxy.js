var url = require('url');

var User = require('./models/user');
var Post = require('./models/post');

module.exports = function() {
  var self = this;

  self.getMappedModel = function(collectionName, next){
    switch (collectionName) {
      case 'users':
        return User;
      case 'posts':
        return Post;
    }

    return null;
  }

  self.middleware = function(req, res, next) {
    var reqUrl = url.parse(req.url, true);

    var Model = self.getMappedModel(req.params.collection);
    if (!Model) {
      return res.send(404, 'Collection cannot be found');
    }

    if (req.method === 'GET') {
      return Model.find(req.query.q, function(err, consultants){
        if (err) return next(err);
        res.send(consultants);
      });
    } else if (req.method === 'POST') {
      return res.send({}); // TO BE IMPLEMENTED
    } else if (req.method === 'PUT') {
      return res.send({}); // TO BE IMPLEMENTED
    } else if (req.method === 'DELETE') {
      return res.send({}); // TO BE IMPLEMENTED
    }

    next(new Error('Only GET, POST, PUT or DELETE method are accepted'));
  };
};
