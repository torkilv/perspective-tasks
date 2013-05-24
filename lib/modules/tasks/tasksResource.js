var Task = require('./task');
var resourceErrors = require('perspective-core').errors.resource;
var backendErrors = require('perspective-core').errors.backend;

var tasksResource = function(serverAPI, tasksService) {

  serverAPI.route('get', '/tasks', function(req, res, next) {
    tasksService.all().then(
      function(tasks) {
        res.send(200, tasks);
        next();
      }
    ).fail(
      function() {
        next(new resourceErrors.GeneralError());
      }
    );
  });

  serverAPI.route('get', '/tasks/:id', function(req, res, next) {

    var task = new Task(req.params);
    var errors = task.validateId();
    if (errors) {
      next(new resourceErrors.ValidationError(errors));
      return;
    }

    tasksService.getById(task.attributes.id).then(
      function(taskResult) {
        res.send(200, taskResult);
        next();
      }
    ).fail(
      function(error) {
        if (error instanceof backendErrors.NotFoundError) {
          next(new resourceErrors.NotFoundError(error.message));
          return;
        }

        next(new resourceErrors.GeneralError());
      }
    );
  });

  serverAPI.route('post', '/tasks', function(req, res, next) {

    var task = new Task(req.body);
    var errors = task.validateCreate();
    if (errors) {
      next(new resourceErrors.ValidationError(errors));
      return;
    }

    tasksService.insert(task).then(
      function(task) {
        res.send(201, task.attributes);
        next();
      }
    ).fail(
      function(error) {
        if (error instanceof backendErrors.NotFoundError) {
          next(new resourceErrors.NotFoundError(error.message));
        } else {
          next(new resourceErrors.GeneralError());
        }
      }
    );

  });

  serverAPI.route('del', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.params);
    var errors = task.validateId();

    if (errors) {
      next(new resourceErrors.ValidationError(errors));
      return;
    }

    tasksService.delete(task.attributes.id).then(
      function() {
        res.send(200);
        next();
      }
    ).fail(
      function() {
        next(new resourceErrors.GeneralError());
      }
    );
  });

  serverAPI.route('patch', '/tasks/:id', function(req, res, next) {
    var taskData = req.body;
    var task = new Task(req.params);
    var errors = task.validateId();

    if (errors) {
      next(new resourceErrors.ValidationError(errors));
      return;
    }

    tasksService.setPosition(task, taskData.previousId, taskData.nextId).then(
      function(task) {
        res.send(200, task.attributes);
      }
    ).fail(
      function() {
        next(new resourceErrors.GeneralError());
      }
    );


  });

};

module.exports = tasksResource;