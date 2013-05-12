var Task = require('./task'),
  Q = require('q');

/* Todo

* Translate db error messages and results
* Write tests
* Need to handle if there is more than one key in result from insert db
* if children on delete, delete them all
* think about introducing a service layer for application logic like reprioritize

 */

var TasksRepository = function(dbAPI) {
  this.dbAPI = dbAPI;
  this.table = 'tasks';
  this.dbAPI.helpers.registerTable(this.table);
};

TasksRepository.prototype.all = function() {
  var deferred = Q.defer();

  this.dbAPI.db.table(this.table).filter(function(task) {
    return task.contains("parent").not().or(
      task.contains("parent").and(task("parent").eq(null)))
  }).orderBy("priority").run(this.dbAPI.connection,

    function(error, cur) {
      if (error) {
        deferred.reject(error);
        return;
      }

      cur.toArray(function(error, results) {
        if (error) {
          deferred.reject(error);
          return;
        }

        deferred.resolve(results);
      });

    });

  return deferred.promise;
};


TasksRepository.prototype.getById = function(id) {
  var deferred = Q.defer();
  this.dbAPI.helpers.get(this.table, id).then(
    function(result) {
      deferred.resolve(result);
    }
  ).fail(
    function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};

TasksRepository.prototype.insert = function(task) {
  var deferred = Q.defer();
  this.dbAPI.helpers.insert(this.table, task.attributes).then(
    function(result) {
      var keys = result.generated_keys;
      if (keys.length === 1) {
        task.attributes.id = keys.pop();
        deferred.resolve(task);
      }
    }
  ).fail(
    function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};

TasksRepository.prototype.delete = function(id) {
  var deferred = Q.defer();
  this.dbAPI.helpers.delete(this.table, id).then(
    function() {
      deferred.resolve(id);
    }
  ).fail(
    function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};

TasksRepository.prototype.delete = function(id) {
  var deferred = Q.defer();
  this.dbAPI.helpers.delete(this.table, id).then(
    function() {
      deferred.resolve(id);
    }
  ).fail(
    function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};

module.exports = TasksRepository;