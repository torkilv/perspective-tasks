var resourceErrorsFactory = require('perspective-core').errors.resourceFactory;
var _ = require('underscore');
var Task = require('./task');

var tasksResource = function(server, tasksService) {

  server.route('get', '/tasks', function(req, res, next) {

    var respond = function(tasks) {

      var tasksResponse = _.map(tasks, function(task) {
        return task.toJSON();
      });

      res.send(200, tasksResponse);
      next();
    };

    tasksService.allParents().
      then(respond).
      fail(resourceErrorsFactory);

  });

  server.route('get', '/tasks/:id', function(req, res, next) {

    var respond = function(task) {
      res.send(200, task);
      next();
    };

    tasksService.get(req.params.id).
      then(respond).
      fail(resourceErrorsFactory);

  });

  server.route('post', '/tasks', function(req, res, next) {

    var respond = function(task) {
      res.send(201, task);
      next();
    };

    tasksService.insert(new Task(req.body), req.body.lastItemInListId).
      then(respond).
      fail(resourceErrorsFactory);

  });

  server.route('del', '/tasks/:id', function(req, res, next) {

    var respond = function() {
      res.send(200);
      next();
    };

    tasksService.delete(req.params.id).
      then(respond).
      fail(resourceErrorsFactory);
  });

  server.route('patch', '/tasks/:id', function(req, res, next) {

    var respond = function(task) {
      res.send(200, task);
      next();
    };

    var taskData = req.body;

    tasksService.setPosition(new Task(req.params), taskData.previousId, taskData.nextId).
      then(respond).
      fail(resourceErrorsFactory);

  });

  server.route('put', '/tasks/:id', function(req, res, next) {
    var respond = function(task) {
      res.send(200, task);
      next();
    };

    tasksService.update(new Task(req.body)).
      then(respond).
      fail(resourceErrorsFactory);
  });

};

module.exports = tasksResource;