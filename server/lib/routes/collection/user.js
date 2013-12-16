var User = require('../../models/user');
var url = require('url');

exports.addRoutes = function(app, security) {

  app.get('/', function(req, res, next){
    User.find(JSON.parse(req.query.q), function(err, users){
      if (err) return next(err);
      res.send(users);
    });
  });

  app.get('/:id', function(req, res, next){
    User.findById(req.params.id, function(err, user){
      if (err) return next(err);
      res.send(user);
    });
  });

  app.post('/', function(req, res, next){
    var data = req.body;
    data.language = 'fr';
    data.status = 'consultant';
    new User(req.body).save(function(err){
      if (err) return next(err);
      res.send('User saved');
    });
  });

  app.put('/', function(req, res, next){
    res.send({}); // TO BE IMPLEMENTED
  });

  app.delete('/', function(req, res, next){
    res.send({}); // TO BE IMPLEMENTED
  });

};
