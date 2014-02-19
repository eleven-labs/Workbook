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
    new User(req.body).save(function(err){
      if (err) return next(err);
      res.send('User inserted');
    });
  });

  app.put('/:id', function(req, res, next){
    change = {}
    updatableFields = ['lastName', 'firstName', 'status']
    Object.keys(req.body).forEach(function(field){
      if (updatableFields.indexOf(field) !== -1) {
        change[field] = req.body[field];
      }
    });
    User.findByIdAndUpdate(req.params.id, updatableFields, function(err){
      if (err) return next(err);
      res.send('User updated');
    });
  });

  app.delete('/:id', function(req, res, next){
    User.findByIdAndRemove(req.params.id, function(err){
      if (err) return next(err);
      res.send('User deleted');
    });
  });

};
