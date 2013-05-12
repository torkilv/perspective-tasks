var Label = require('./label'),
  Q = require('q');

/* Todo

 * Translate db error messages and results
 * Write tests
 * Need to handle if there is more than one key in result from insert db

 */

var LabelsRepository = function(dbAPI) {
  this.dbAPI = dbAPI;
  this.table = 'labels';
  this.dbAPI.helpers.registerTable(this.table);
};

LabelsRepository.prototype.all = function() {
  var deferred = Q.defer();

  this.dbAPI.db.table(this.table).orderBy("value").run(this.dbAPI.connection,
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


LabelsRepository.prototype.getById = function(id) {
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

LabelsRepository.prototype.insert = function(label) {
  var deferred = Q.defer();
  this.dbAPI.helpers.insert(this.table, label.attributes).then(
    function(result) {
      var keys = result.generated_keys;
      if (keys.length === 1) {
        label.attributes.id = keys.pop();
        deferred.resolve(label);
      }
    }
  ).fail(
    function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};

LabelsRepository.prototype.delete = function(id) {
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

module.exports = LabelsRepository;