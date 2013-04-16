module.exports = function(imports, config) {
  var serverAPI = imports.server;

  return {
    setup: function() {
      serverAPI.route('get', '/lists', function(req, res, next) {
        res.send(config);
        next();
      });
    }
  }
};