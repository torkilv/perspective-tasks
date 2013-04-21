var Task = require('./task');

var setupTasks = function(serverAPI, dbAPI) {
  dbAPI.registerTable('tasks');

  serverAPI.route('get', '/tasks', function(req, res, next) {

    var tasks = dbAPI.get("tasks", function(result){
      res.send(200, result);
      next();
    });

  });

  serverAPI.route('get', '/tasks/:id', function(req, res, next) {
    var task = new Task(req.params);
    var errors = task.validateGet();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
      return;
    }

    dbAPI.get('tasks', function(result) {

      res.send(200, result);
      next();
    }, task.attributes.id);

  });

  serverAPI.route('post', '/tasks', function(req, res, next) {
    var task = new Task(req.body);
    var errors = task.validateCreate();

    if (errors !== undefined) {
      res.send(400, errors);
      next();
      return;
    }

    dbAPI.insert('tasks', task.attributes, function() {
      res.send(201, task.attributes);
      next();
    });

  });
};

module.exports = setupTasks;