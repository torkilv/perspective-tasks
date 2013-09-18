var resourceErrorsFactory = require('perspective-core').errors.resourceFactory;
var _ = require('underscore');
var Task = require('./task');

var tasksResource = function(serverAPI, tasksService) {

  serverAPI.route('get', '/tasks', function(req, res, next) {

    var respondWithTasks = function(tasks) {

      var tasksResponse = _.map(tasks, function(task) {
        return task.toJSON();
      });

      res.send(200, tasksResponse);
      next();
    };

    tasksService.all().
      then(respondWithTasks).
      fail(resourceErrorsFactory);

  });

  serverAPI.route('get', '/tasks/:id', function(req, res, next) {

    var respondWithTask = function(task) {
      res.send(200, task);
      next();
    };

    tasksService.get(req.params.id).
      then(respondWithTask).
      fail(resourceErrorsFactory);

  });

  serverAPI.route('post', '/tasks', function(req, res, next) {

    var respondWithTask = function(task) {
      res.send(201, task);
      next();
    };

    tasksService.insert(new Task(req.body), req.body.lastItemInListId).
      then(respondWithTask).
      fail(resourceErrorsFactory);

  });

  serverAPI.route('del', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.params);

    var respondWithSuccess = function() {
      res.send(200);
      next();
    };

    tasksService.delete(task.attributes.id).
      then(respondWithSuccess).
      fail(resourceErrorsFactory);
  });

  serverAPI.route('patch', '/tasks/:id', function(req, res, next) {

    var taskData = req.body;
    var task = new Task(req.params);

    var respondWithSuccess = function(task) {
      res.send(200, task);
      next();
    };

    tasksService.setPosition(task, taskData.previousId, taskData.nextId).
      then(respondWithSuccess).
      fail(resourceErrorsFactory);

  });

  serverAPI.route('put', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.body);

    var respondWithSuccess = function(task) {
      res.send(200, task);
      next();
    };

    tasksService.update(task).
      then(respondWithSuccess).
      fail(resourceErrorsFactory);
  });

};

module.exports = tasksResource;