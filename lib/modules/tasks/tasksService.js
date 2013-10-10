var Q = require('q');
var positionCalculator = require('./positionCalculator');
var backendErrors = require('perspective-core').errors.backend;
var logger = require('../../tasksLogger');
var Task = require('./task');

/* Todo

 * if task has children on delete, delete them all

 */

var TasksService = function(taskRepository) {
  this.taskRepository = taskRepository;
};

TasksService.prototype.all = function() {
  return this.taskRepository.all();
};

TasksService.prototype.get = function(id) {
  var deferred = Q.defer();

  var task = new Task({id: id});
  var errors = task.validateId();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  this.taskRepository.get(id).then(function(task) {
    deferred.resolve(task);
  }).fail(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;

};

TasksService.prototype.insert = function(task, lastItemInListId) {
  var deferred = Q.defer();

  var errors = task.validateInsert();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  var that = this;
  var insert = function() {
    that.getPosition(lastItemInListId, null).then(function(position) {

      task.attr.position = position;

      logger.debug("Inserting task", task.attr);

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
    this.taskRepository.get(task.attr.parent).then(function(parent) {
      if (!parent) {
        deferred.reject(new backendErrors.NotFoundError("Could not find parent with id: " + task.attr.parent));
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

  var deferred = Q.defer();

  var errors = task.validateId();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  this.taskRepository.update(task).then(function(task) {
    deferred.resolve(task);
  }).fail(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;
};

TasksService.prototype.delete = function(id) {

  var deferred = Q.defer();

  var task = new Task({id: id});
  var errors = task.validateId();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  this.taskRepository.delete(id).then(function(task) {
    deferred.resolve(task);
  }).fail(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;

};

TasksService.prototype.setPosition = function(task, previousId, nextId) {

  var deferred = Q.defer();

  var that = this;

  this.getPosition(previousId, nextId).then(function(position) {
    task.attr.position = position;

    logger.debug("Updating position for task", task.attr);

    that.update(task).then(function(task) {
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

  var promises = [];

  if (previousId) {
    promises.push(this.taskRepository.get(previousId))
  }

  if (nextId) {
    promises.push(this.taskRepository.get(nextId));
  }

  Q.allSettled(promises).then(function(results) {

    var previous = undefined, next = undefined;
    results.forEach(function(result) {
      if (result.value.attr.id === previousId) {
        previous = result.value;
      } else if (result.value.attr.id === nextId) {
        next = result.value;
      }
    });

    var position;
    if (!previous && !next) {
      position = positionCalculator.calculateLastItem();
    } else if (previous && !next) {
      position = positionCalculator.calculateLastItem(previous.attr.position);
    } else if (!previous && next) {
      position = positionCalculator.calculate(next.attr.position, null);
    } else {
      position = positionCalculator.calculate(next.attr.position, previous.attr.position);
    }

    deferred.resolve(position);

  }).fail(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;
};

module.exports = TasksService;