var Label = require('./label');

var LabelsService = function(labelRepository) {
  this.labelRepository = labelRepository;
};

LabelsService.prototype.allParents = function() {
  return this.labelRepository.all();
};

LabelsService.prototype.get = function(id) {
  var deferred = Q.defer();

  var label = new Label({id: id});
  var errors = label.validateId();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  this.labelRepository.get(id).then(function(label) {
    deferred.resolve(label);
  }).fail(function(error) {
      deferred.reject(error);
  });

  return deferred.promise;

};

LabelsService.prototype.insert = function(label) {
  var deferred = Q.defer();

  var errors = label.validateInsert();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  var that = this;

  that.labelRepository.insert(label).then(
    function(label) {
      deferred.resolve(label);
    }
  ).
    fail(
    function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};

LabelsService.prototype.update = function(label) {

  var deferred = Q.defer();

  var errors = label.validateId();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  this.labelRepository.update(label).
    then(function(label) {
      deferred.resolve(label);
    }
  ).fail(function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};

LabelsService.prototype.delete = function(id) {

  var deferred = Q.defer();

  var label = new Label({id: id});
  var errors = label.validateId();
  if (errors) {
    deferred.reject(new backendErrors.ValidationError(errors));
  }

  this.labelRepository.delete(id).then(function(label) {
    deferred.resolve(label);
  }).fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;

};

module.exports = LabelsService;