var rewire = require('rewire');
var proxy = rewire('../lib/mongo-proxy');
var url = require('url');

module.exports = {
  proxy: {
    test: function(test) {
      test.done(); // IMPLEMENT TESTS
    }
  }
};
