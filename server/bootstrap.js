var config = require('./config.js');
var mongoose = require('mongoose');
var winston = require('winston');

mongoose.connect(config.Mongo.dbUris.join(','), config.Mongo.options, function (err) {
  if (err) throw(err);
});

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {timestamp: true, colorize: true});
