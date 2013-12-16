var Post = require('../../models/post');

exports.addRoutes = function(app, security) {

  app.get('/', function(req, res, next){
    return Post.find(req.query.q, function(err, posts){
      if (err) return next(err);
      res.send(posts);
    });
  });

  app.get('/:id', function(req, res, next){
    return Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      res.send(post);
    });
  });

  app.post('/', function(req, res, next){
    res.send({}); // TO BE IMPLEMENTED
  });

  app.put('/', function(req, res, next){
    res.send({}); // TO BE IMPLEMENTED
  });

  app.delete('/', function(req, res, next){
    res.send({}); // TO BE IMPLEMENTED
  });

};
