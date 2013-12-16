exports.addRoutes = function(app) {
  app.use('/collection', function(req, res, next){
    if ( req.method !== 'GET' ) {
      // We require the user is authenticated to modify any collections
      security.authenticationRequired(req, res, next);
    } else {
      next();
    }
  });

  app.use('/collection', function(req, res, next){
    if ( req.method !== 'GET' && (req.params.collection === 'users' || req.params.collection === 'posts') ) {
      return security.adminRequired(req, res, next);
    }
    next();
  });

  app.namespace('/collection', function() {
    app.namespace('/users', function() {
      require('./collection/user').addRoutes(app);
    });
    app.namespace('/posts', function() {
      require('./collection/post').addRoutes(app);
    });
  });
};
