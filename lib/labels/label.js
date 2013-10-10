var validation = require('perspective-core').validation;
var Model = require('perspective-core').Model;


var Label = Model.extend({
  defaults: {
    id: undefined,
    value: undefined
  },
  createValidationRules: {
    value: {
      required: true
    }
  },
  idValidationRules: {
    id: {
      required: true
    }
  },
  validateInsert: function() {
    return validation(this.attributes, this.createValidationRules);
  },
  validateId: function() {
    return validation(this.attributes, this.idValidationRules);
  }
});

module.exports = Label;