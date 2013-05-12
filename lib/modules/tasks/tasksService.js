var Task = require('./task'),
  Q = require('q');


var TasksService = function(taskRepository) {
  this.taskRepository = taskRepository;
};

TasksService.prototype.reprioritize = function(task, previousId, nextId) {
  var deferred = Q.defer();

  if (previousId && nextId) {

    Q.all()
    this.taskRepository.getById(previousId).then()

  } else if (previousId) {

  } else if (nextId) {

  }


  console.log("reprioritize");

  return deferred.promise;
};

module.exports = TasksService;