var express = require('express');

exports.addRoutes = function(app, distFolder, staticUrl) {
  // Serve up the favicon
  app.use(express.favicon(distFolder + '/favicon.ico'));

  // First looks for a static file: index.html, css, images, etc.
  app.use(staticUrl, express.compress());
  app.use(staticUrl, express.static(distFolder));
  app.use(staticUrl, function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
  });
};
