var Post = require('../../models/post');

exports.addRoutes = function(app, security) {

  app.get('/', function(req, res, next){
    var numPosts = parseInt(req.query.numPosts);
    var maxNumLastPostComments = parseInt(req.query.maxNumLastPostComments);
    Post.getList(numPosts, maxNumLastPostComments, function(err, posts){
      if (err) return next(err);
      res.send(posts);
    });
  });

  app.get('/:id', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      res.send(post);
    });
  });

  app.get('/:id/previous', function(req, res, next){
    var numPosts = parseInt(req.query.numPosts);
    var maxNumLastPostComments = parseInt(req.query.maxNumLastPostComments);
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      Post.getList(numPosts, maxNumLastPostComments, post.dateCreation, function(err, posts){
        if (err) return next(err);
        res.send(posts);
      });
    });
  });

  app.post('/', function(req, res, next){
    var data = req.body;
    data.creator = req.user;
    data.owner   = req.user;
    new Post(req.body).save(function(err, post){
      if (err) return next(err);
      res.send(post);
    });
  });

  app.put('/:id', function(req, res, next){
    Post.findByIdAndUpdate(req.params.id, req.body, function(err, post){
      if (err) return next(err);
      res.send(post);
    });
  });

  app.delete('/:id', function(req, res, next){
    Post.findByIdAndRemove(req.params.id, function(err){
      if (err) return next(err);
      res.send();
    });
  });

  app.get('/:id/comments', function(req, res, next){
    var offsetFromEnd = parseInt(req.query.numCommentsAlreadyDisplay);
    var maxNumLast    = parseInt(req.query.maxNumLastPostComments);
    Post.getListOfCommentsById(req.params.id, maxNumLast, offsetFromEnd, function(err, comments){
      if (err) return next(err);
      res.send(comments);
    });
  });

  app.get('/:id/comment/:commentId', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('Post not found'));
      res.send(post.getComment(req.params.commentId));
    });
  });

  app.post('/:id/comment', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('Post not found'));
      post.addComment(req.user._id, req.body.message, function(err){
        if (err) return next(err);
        res.send(post);
      });
    });
  });

  app.delete('/:id/comment/:commentId/remove', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('Post not found'));
      post.removeComment(req.user._id, req.params.commentId, function(err){
        if (err) return next(err);
        res.send(post);
      });
    });
  });

  app.post('/:id/like', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('Post not found'));
      post.addLike(req.user._id, function(err){
        if (err) return next(err);
        res.send(post);
      });
    });
  });

  app.post('/:id/unlike', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('Post not found'));
      post.removeLike(req.user._id, function(err){
        if (err) return next(err);
        res.send(post);
      });
    });
  });

  app.post('/:id/comment/:commentId/like', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('Post not found'));
      post.addLikeToComment(req.user._id, req.params.commentId, function(err){
        if (err) return next(err);
        res.send(post);
      });
    });
  });

  app.post('/:id/comment/:commentId/unlike', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('Post not found'));
      post.removeLikeFromComment(req.user._id, req.params.commentId, function(err){
        if (err) return next(err);
        res.send(post);
      });
    });
  });
};
