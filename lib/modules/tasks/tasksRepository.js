var Q = require('q');

/* Todo

* Write tests

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
  }).orderBy(this.dbAPI.r.desc("position")).run(this.dbAPI.connection,

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

TasksRepository.prototype.update = function(task) {
  return this.dbAPI.helpers.update(this.table, task.attributes.id, task.attributes);
};

TasksRepository.prototype.getById = function(id) {
  return this.dbAPI.helpers.get(this.table, id);
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
  return this.dbAPI.helpers.delete(this.table, id);
};

module.exports = TasksRepository;