var validation = require('perspective-validation');

var List = function(attributes) {
  this.attributes = attributes;
};

List.prototype.defaults = {

  id: undefined,
  name: undefined,
  description: undefined,
  relations: undefined

};

List.prototype.createValidationRules = {

  title: {
    required: true
  }

};

List.prototype.getValidationRules = {
  id: {
    required: true
  }
};


List.prototype.validateCreate = function() {
  return validation(this.attributes, this.createValidationRules);
};

List.prototype.validateGet = function() {
  return validation(this.attributes, this.getValidationRules);
};

module.exports = List;