var Task = require('./task');

var setupTasks = function(serverAPI, dbAPI) {
  var table = 'tasks';
  dbAPI.registerTable(table);

  serverAPI.route('get', '/tasks', function(req, res, next) {
    dbAPI.get(table, function(result){
      res.send(200, result);
      return next();
    });
  });

  serverAPI.route('get', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.params);
    var errors = task.validateId();

    if (errors !== undefined) {
      res.send(400, errors);
      return next();
    }

    dbAPI.get(table, function(result) {
      res.send(200, result);
      return next();
    }, task.attributes.id);

  });

  serverAPI.route('post', '/tasks', function(req, res, next) {
    var task = new Task(req.body);
    var errors = task.validateCreate();

    if (errors !== undefined) {
      res.send(400, errors);
      return next();
    }

    dbAPI.insert(table, task.attributes, function(result) {
      res.send(201, result);
      return next();
    });

  });

  serverAPI.route('del', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.params);
    var errors = task.validateId();

    if (errors !== undefined) {
      res.send(400, errors);
      return next();
    }

    dbAPI.delete(table, function() {
      res.send(200);
      return next();
    }, task.attributes.id);

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

module.exports = setupTasks;