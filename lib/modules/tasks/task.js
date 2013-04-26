var validation = require('perspective-validation');

var Task = function(attributes) {
  this.attributes = attributes;
};

Task.prototype.defaults = {

  id: undefined,
  name: undefined,
  description: undefined,
  relations: undefined

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


Task.prototype.validateCreate = function() {
  return validation(this.attributes, this.createValidationRules);
};

Task.prototype.validateId = function() {
  return validation(this.attributes, this.idValidationRules);
};

module.exports = Task;