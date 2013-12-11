var url = require('url');
var qs = require('querystring');

module.exports = function(req, res, next) {
  var reqUrl = url.parse(req.url, true);
  if (req.method === 'GET') {
    return res.send({}); // TO BE IMPLEMENTED
  } else if (req.method === 'POST') {
    return res.send({}); // TO BE IMPLEMENTED
  } else if (req.method === 'PUT') {
    return res.send({}); // TO BE IMPLEMENTED
  } else if (req.method === 'DELETE') {
    return res.send({}); // TO BE IMPLEMENTED
  }

  next(new Error('Only GET, POST, PUT or DELETE method are accepted'));
};
