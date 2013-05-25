var validation = require('perspective-core').validation;

var Task = function(attributes) {

  if (attributes.lastItemInListId) {
    this.lastItemInListId = attributes.lastItemInListId;
    delete attributes.lastItemInListId;
  }

  this.attributes = attributes;
};

Task.prototype.defaults = {
  id: undefined,
  title: undefined,
  description: undefined,
  workflow: undefined,
  parent: undefined,
  status: undefined,
  position: undefined,
  labels: undefined,
  relations: undefined,
  children: undefined
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

module.exports = Task;