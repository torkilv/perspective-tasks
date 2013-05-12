var tasksResource = require('./modules/tasks/tasksResource'),
  TasksRepository = require('./modules/tasks/tasksRepository'),
  labelsResource = require('./modules/labels/labelResource'),
  LabelsRepository = require('./modules/labels/labelRepository');

module.exports = function(imports, config) {
  var serverAPI = imports.server;
  var dbAPI = imports.db;

  return {
    setup: function() {
      var tasksRepo = new TasksRepository(dbAPI);
      tasksResource(serverAPI, tasksRepo);

      var labelsRepository = new LabelsRepository(dbAPI);
      labelsResource(serverAPI, labelsRepository);
    }
  };
};