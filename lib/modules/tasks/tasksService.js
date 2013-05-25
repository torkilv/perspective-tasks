var Q = require('q');
var positionCalculator = require('./positionCalculator');
var backendErrors = require('perspective-core').errors.backend;

/* Todo

 * if task has children on delete, delete them all

 */

var TasksService = function(taskRepository) {
  this.taskRepository = taskRepository;
};

TasksService.prototype.all = function() {
  return this.taskRepository.all();
};

TasksService.prototype.getById = function(id) {
  var deferred = Q.defer();

  this.taskRepository.getById(id).then(function(task) {

    if (!task) {
      deferred.reject(new backendErrors.NotFoundError("Could not find task with id: " + id));
      return;
    }

    deferred.resolve(task);

  }).fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

TasksService.prototype.insert = function(task) {
  var deferred = Q.defer();

  var that = this;
  var insert = function() {
    that.getPosition(task.lastItemInListId, null).then(function(position) {
      if (position) {
        task.attributes.position = position;
      }

      that.taskRepository.insert(task).then(
        function(task) {
          deferred.resolve(task);
        }
      ).fail(function(error) {
          deferred.reject(error);
        });
    }).fail(function(error) {
      deferred.reject(error);
    });
  };

  if (task.hasParent()) {
    this.taskRepository.getById(task.attributes.parent).then(function(parent) {
      if (!parent) {
        deferred.reject(new backendErrors.NotFoundError("Could not find parent with id: " + task.attributes.parent));
        return;
      }

      that.insert();

    }).fail(function(error) {
        deferred.reject(error);
      });

  } else {
    insert();
  }

  return deferred.promise;
};

TasksService.prototype.update = function(task) {
  return this.taskRepository.update(task);
};

TasksService.prototype.delete = function(id) {
  return this.taskRepository.delete(id);
};

TasksService.prototype.setPosition = function(task, previousId, nextId) {
  var deferred = Q.defer();

  var that = this;

  this.getPosition(previousId, nextId).then(function(position) {
    task.attributes.position = position;
    that.update(task).then(function() {
        deferred.resolve(task);
      }
    ).fail(function(error) {
        deferred.reject(error);
      });
  }).fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

TasksService.prototype.getPosition = function(previousId, nextId) {
  var deferred = Q.defer();
  Q.all([
      this.taskRepository.getById(previousId),
      this.taskRepository.getById(nextId),
    ]).then(function(result) {
      var previous = {}, next = {};
      result.forEach(function(task) {
        if (task.id === previousId) {
          previous = task;
        } else if (task.id === nextId) {
          next = task;
        }
      });

      deferred.resolve(positionCalculator.calculate(next.position, previous.position));

    }).fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

module.exports = TasksService;