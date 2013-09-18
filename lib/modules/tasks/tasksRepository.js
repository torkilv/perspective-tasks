var Q = require('q');
var Task = require('./task');
var _ = require('underscore');
var logger = require('../../tasksLogger');

/* Todo

* Write tests

 */

var TasksRepository = function(createRepository) {
  _.extend(this, createRepository('tasks', Task));

  this.all = function() {
    var deferred = Q.defer();

    this.table().filter(function(dbTaskFilter) {
      return dbTaskFilter.hasFields("parent").not().or(
        dbTaskFilter.hasFields("parent").and(dbTaskFilter("parent").eq(null)))
    }).orderBy("position").run(this.connection, this.createStandardArrayCallback(deferred));

    return deferred.promise;
  };

};

module.exports = TasksRepository;