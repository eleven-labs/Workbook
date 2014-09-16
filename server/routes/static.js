var compression = require('compression');
var serveStatic = require('serve-static');
var favicon     = require('serve-favicon');

exports.addRoutes = function(app, distFolder, staticUrl) {
  // Serve up the favicon
  app.use(favicon(distFolder + '/favicon.ico'));

  // First looks for a static file: index.html, css, images, etc.
  app.use(staticUrl, compression());
  app.use(staticUrl, serveStatic(distFolder));
  app.use(staticUrl, function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
  });
};
