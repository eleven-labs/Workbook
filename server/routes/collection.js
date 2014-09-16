var express = require('express');
var collectionRouter = express.Router();
var userRouter = express.Router();
var postRouter = express.Router();

exports.addRoutes = function(app, security) {
  app.use('/collection', function(req, res, next){
    if ( req.method !== 'GET' ) {
      // We require the user is authenticated to modify any collections
      security.authenticationRequired(req, res, next);
    } else {
      next();
    }
  });

  app.use('/collection/:collection', function(req, res, next){
    if ( req.method !== 'GET' && (req.params.collection === 'users' || req.params.collection === 'posts') ) {
      return security.adminRequired(req, res, next);
    }
    next();
  });

  app.use('/collection', collectionRouter);
  collectionRouter.use('/users', userRouter);
  collectionRouter.use('/posts', postRouter);

  require('./collection/user').addRoutes(userRouter);
  require('./collection/post').addRoutes(postRouter);
};
