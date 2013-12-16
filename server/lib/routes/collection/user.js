var User = require('../../models/user');

exports.addRoutes = function(app, security) {

  app.get('/', function(req, res, next){
    return User.find(req.query.q, function(err, users){
      if (err) return next(err);
      res.send(users);
    });
  });

  app.get('/:id', function(req, res, next){
    return User.findById(req.params.id, function(err, user){
      if (err) return next(err);
      res.send(user);
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
