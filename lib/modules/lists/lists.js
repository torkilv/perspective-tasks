var List = require('./list');

var setupList = function(serverAPI, dbAPI) {
  var table = 'lists';
  dbAPI.registerTable(table);

  serverAPI.route('get', '/lists', function(req, res, next) {
    dbAPI.get(table, function(result) {
      res.send(200, result);
      next();
    });
  });

  serverAPI.route('get', '/lists/:id', function(req, res, next) {
    var list = new List(req.params);
    var errors = list.validateGet();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
      return;
    }

    dbAPI.get(table, function(result) {
      res.send(200, result);
      next();
    }, list.attributes.id);

  });

  serverAPI.route('post', '/lists', function(req, res, next) {
    var list = new List(req.body);
    var errors = list.validateCreate();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
      return;
    }

    dbAPI.insert(table, list.attributes, function() {
      res.send(201, list.attributes);
      next();
    });
  });
};

module.exports = setupList;