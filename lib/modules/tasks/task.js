var validation = require('perspective-core').validation;
var Model = require('perspective-core').Model;
var _ = require('underscore');

var Task = Model.extend({
  defaults: {
    id: undefined,
    title: undefined,
    description: undefined,
    parent: undefined,
    position: undefined,
    labels: undefined
  },
  createValidationRules: {
    title: {
      required: true
    }
  },
  idValidationRules: {
    id: {
      required: true
    }
  },
  hasParent: function() {
    return this.attr.parent !== undefined;
  },
  validateCreate: function() {
    return validation(this.attr, this.createValidationRules);
  },
  validateId: function() {
    return validation(this.attr, this.idValidationRules);
  }
});

module.exports = Task;