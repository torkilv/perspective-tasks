var Label = require('./label');
var _ = require('underscore');
var resourceErrorsFactory = require('perspective-core-rest').error.factory;

var labelsResource = function(server, labelsService) {

  server.route('get', '/labels', function(req, res, next) {

    var respond = function(labels) {

      var response = _.map(labels, function(label) {
        return label.toJSON();
      });

      res.send(200, response);
      next();
    };

    labelsService.all().
      then(respond).
      fail(resourceErrorsFactory);

  });

  server.route('get', '/labels/:id', function(req, res, next) {

    var respond = function(label) {
      res.send(200, label);
      next();
    };

    labelsService.get(req.params.id).
      then(respond).
      fail(resourceErrorsFactory);

  });

  server.route('post', '/labels', function(req, res, next) {

    var respond = function(label) {
      res.send(201, label);
      next();
    };

    labelsService.insert(new Label(req.body)).
      then(respond).
      fail(resourceErrorsFactory);

  });

  server.route('del', '/labels/:id', function(req, res, next) {

    var respond = function() {
      res.send(200);
      next();
    };

    labelsService.delete(req.params.id).
      then(respond).
      fail(resourceErrorsFactory);
  });

  server.route('put', '/labels/:id', function(req, res, next) {

    var respond = function(task) {
      res.send(200, task);
      next();
    };

    labelsService.update(new Label(req.body)).
      then(respond).
      fail(resourceErrorsFactory);
  });

};

module.exports = labelsResource;
