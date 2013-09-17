var Q = require('q');
var Task = require('./task');
var _ = require('underscore');
var logger = require('../../tasksLogger');

/* Todo

* Write tests

 */

var TasksRepository = function(createRepository) {
  this.repository = createRepository('tasks', Task);
};

TasksRepository.prototype.all = function() {
  var deferred = Q.defer();

  this.repository.table().filter(function(dbTaskFilter) {
    return dbTaskFilter.hasFields("parent").not().or(
      dbTaskFilter.hasFields("parent").and(dbTaskFilter("parent").eq(null)))
  }).orderBy("position").run(this.repository.connection,

    function(error, cur) {
      if (error) {
        logger.error(error)
        deferred.reject(error);
        return;
      }

      cur.toArray(function(error, dbTasks) {
        if (error) {
          deferred.reject(error);
          return;
        }

        var tasks = _.map(dbTasks, function(dbTask) {
          return new Task(dbTask);
        });

        console.log(tasks);

        deferred.resolve(tasks);
      });

    });

  return deferred.promise;
};

TasksRepository.prototype.getById = function(id) {
  return this.repository.get(id);
};

TasksRepository.prototype.insert = function(task) {
  return this.repository.insert(task);
};


TasksRepository.prototype.update = function(task) {
  return this.repository.update(task.attributes.id, task.attributes);
};

TasksRepository.prototype.delete = function(id) {
  return this.repository.delete(id);
};

module.exports = TasksRepository;