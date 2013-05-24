var validation = require('perspective-core').validation;

var Label = function(attributes) {
  this.attributes = attributes;
};

Label.prototype.defaults = {

 id: undefined,
 value: undefined

};

Label.prototype.createValidationRules = {

  value: {
    required: true
  }

};

Label.prototype.idValidationRules = {

  id: {
    required: true
  }

};


Label.prototype.validateCreate = function() {
  return validation(this.attributes, this.createValidationRules);
};

Label.prototype.validateId = function() {
  return validation(this.attributes, this.idValidationRules);
};

module.exports = Label;