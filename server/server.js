var fs      = require('fs');
var path    = require('path');
var config  = require('config');
var http    = require('http');
var https   = require('https');
var winston = require('winston');

var privateKey  = fs.readFileSync(__dirname + '/cert/privatekey.pem').toString();
var certificate = fs.readFileSync(__dirname + '/cert/certificate.pem').toString();
var distFolder  = path.resolve(__dirname, '../client/dist');
var credentials = {key: privateKey, cert: certificate};

require('./bootstrap');

var express     = require('express');
var passport    = require('passport');
var security    = require('./lib/security');
var xsrf        = require('./lib/xsrf');
var protectJSON = require('./lib/protectJSON');

require('express-namespace');

var app          = express();
var secureServer = https.createServer(credentials, app);
var server       = http.createServer(app);

require('./routes/static').addRoutes(app, distFolder, config.server.staticUrl);

app.use(protectJSON);

app.use(express.logger());                                  // Log requests to the console
app.use(express.bodyParser());                              // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(express.cookieParser(config.server.cookieSecret));  // Hash cookies with this secret
app.use(express.cookieSession());                           // Store the session in the (secret) cookie
app.use(passport.initialize());                             // Initialize PassportJS
app.use(passport.session());                                // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
app.use(xsrf);                                              // Add XSRF checks to the request
security.initialize();                                      // Add a Mongo strategy for handling the authentication

app.use(function(req, res, next) {
  if ( req.user ) {
    console.info('Current User:', req.user.firstName, req.user.lastName);
  } else {
    console.info('Unauthenticated');
  }
  next();
});

require('./routes/collection').addRoutes(app, security);
require('./routes/security').addRoutes(app, security);
require('./routes/appFile').addRoutes(app, distFolder);

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
server.listen(config.server.listenPort, '0.0.0.0', 511, function() {
  // // Once the server is listening we automatically open up a browser
  var open = require('open');
  open('http://localhost:' + config.server.listenPort + '/');
});
console.log('Angular App Server - listening on port: ' + config.server.listenPort);
secureServer.listen(config.server.securePort);
console.log('Angular App Server - listening on secure port: ' + config.server.securePort);
