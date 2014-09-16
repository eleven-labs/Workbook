var express      = require('express');
require('express-namespace');
var fs           = require('fs');
var path         = require('path');
var config       = require('config');
var http         = require('http');
var https        = require('https');
var winston      = require('winston');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('cookie-session');
var morgan       = require('morgan');
var errorhandler = require('errorhandler');

var privateKey  = fs.readFileSync(__dirname + '/cert/privatekey.pem').toString();
var certificate = fs.readFileSync(__dirname + '/cert/certificate.pem').toString();
var distFolder  = path.resolve(__dirname, '../client/dist');

require('./bootstrap');

var passport    = require('passport');
var security    = require('./lib/security');
var protectJSON = require('./lib/protectJSON');

var app          = express();

require('./routes/static').addRoutes(app, distFolder, config.server.staticUrl);

app.use(protectJSON);

app.use(morgan('combined'));                        // Log requests to the console
app.use(bodyParser.json());                         // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(cookieParser(config.server.cookieSecret));  // Hash cookies with this secret
app.use(session({keys: ['dummy key']}));            // Store the session in the (secret) cookie
app.use(passport.initialize());                     // Initialize PassportJS
app.use(passport.session());                        // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
security.initialize();                              // Add a Mongo strategy for handling the authentication

app.use(function(req, res, next) {
  if ( req.user ) {
    console.info('Current User:', req.user.firstName, req.user.lastName);
  } else {
    console.info('Unauthenticated');
  }
  next();
});

require('./routes/signup')       .addRoutes(app);
require('./routes/resetPassword').addRoutes(app);
require('./routes/collection')   .addRoutes(app, security);
require('./routes/security')     .addRoutes(app, security);
require('./routes/appFile')      .addRoutes(app, distFolder);

app.use(errorhandler());

// Start up the server on the port specified in the config
app.listen(config.server.listenPort, function() {
  // // Once the server is listening we automatically open up a browser
  var open = require('open');
  open('http://localhost:' + config.server.listenPort + '/');
});
