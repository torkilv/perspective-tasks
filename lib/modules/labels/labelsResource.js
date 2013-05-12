var Label = require('./label');

var labelsResource = function(serverAPI, repo) {

  serverAPI.route('get', '/labels', function(req, res, next) {
    repo.all().then(
      function(labels) {
        res.send(200, labels);
        next();
      }
    ).fail(
      function(error) {
        serverAPI.serverError(res, next);
      }
    );
  });

  serverAPI.route('get', '/labels/:id', function(req, res, next) {
    var label = new Label(req.params);
    var errors = label.validateId();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
      return;
    }

    repo.getById(label.attributes.id).then(
      function(label) {
        res.send(200, label);
        next();
      }
    ).fail(
      function(error) {
        serverAPI.serverError(res, next);
      }
    );
  });

  serverAPI.route('post', '/labels', function(req, res, next) {

    var label = new Label(req.body);
    var errors = label.validateCreate();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
      return;
    }

    repo.insert(label).then(
      function(label) {
        res.send(201, label.attributes);
        next();
      }
    ).fail(
      function(error) {
        serverAPI.serverError(res, next);
      }
    );
  });

  serverAPI.route('del', '/labels/:id', function(req, res, next) {
    var label = new Label(req.params);
    var errors = label.validateId();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
      return;
    }

    repo.delete(label.attributes.id).then(
      function() {
        res.send(200);
        next();
      }
    ).fail(
      function(){
        serverAPI.serverError(res, next);
      }
    );
  });

};

module.exports = labelsResource;