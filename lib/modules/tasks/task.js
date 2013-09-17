var validation = require('perspective-core').validation;
var _ = require('underscore');

var Task = function(attributes) {

  this.attributes = _.pick(attributes, _.keys(Task.prototype.defaults));

};

Task.prototype.defaults = {
  id: undefined,
  title: undefined,
  description: undefined,
  parent: undefined,
  position: undefined,
  labels: undefined
};

Task.prototype.createValidationRules = {
  title: {
    required: true
  }
};

Task.prototype.idValidationRules = {
  id: {
    required: true
  }
};

Task.prototype.hasParent = function() {
  return this.attributes.parent !== undefined;
};

Task.prototype.validateCreate = function() {
  return validation(this.attributes, this.createValidationRules);
};

Task.prototype.validateId = function() {
  return validation(this.attributes, this.idValidationRules);
};

Task.prototype.toJSON = function() {
  return this.attributes;
};

module.exports = Task;