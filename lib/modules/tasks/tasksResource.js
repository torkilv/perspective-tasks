var Task = require('./task');

var tasksResource = function(serverAPI, repo) {

  serverAPI.route('get', '/tasks', function(req, res, next) {
    repo.all().then(
      function(tasks) {
        res.send(200, tasks);
        next();
      }
    ).fail(
      function(error) {
        serverAPI.serverError(res, next);
      }
    );
  });

  serverAPI.route('get', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.params);
    var errors = task.validateId();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
    }

    repo.getById(tasks.attributes.id).then(
      function(task) {
        res.send(200, task);
        next();
      }
    ).fail(
      function(error) {
        serverAPI.serverError(res, next);
      }
    );
  });

  serverAPI.route('post', '/tasks', function(req, res, next) {

      var task = new Task(req.body);

      var errors = task.validateCreate();

      if (errors !== undefined) {
        res.send(400, errors);
        next();
      }

      var insert = function() {
        repo.insert(task).then(
          function(task) {
            res.send(201, task.attributes);
            next();
          }
        ).fail(
          function(error) {
            serverAPI.serverError(res, next);
          }
        );
      };

      if (task.hasParent()) {
        repo.getById(task.attributes.parent).then(insert).fail(
          function() {
            var error = serverAPI.getErrorObject("Could not find parent with id: " + task.attributes.parent);
            res.send(400, error);
            next();
          }
        );

      } else {
        insert();
      }
  });

  serverAPI.route('del', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.params);
    var errors = task.validateId();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
    }

    repo.delete(task.attributes.id).then(
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

  serverAPI.route('patch', '/tasks/:id', function(req, res, next) {
    var taskId = req.params.id,
      taskData = req.body;

    if(taskData.previousId && taskData.nextId) {
      console.log("reprioritize");
    }

    res.send(200);
    next();
  });

};

module.exports = tasksResource;