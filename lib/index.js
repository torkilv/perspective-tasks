var tasksResource = require('./modules/tasks/tasksResource'),
  TasksRepository = require('./modules/tasks/tasksRepository'),
  TasksService = require('./modules/tasks/tasksService'),
  labelsResource = require('./modules/labels/labelsResource'),
  LabelsRepository = require('./modules/labels/labelsRepository');

module.exports = function(imports, config) {
  var serverAPI = imports.server;
  var dbAPI = imports.db;

  return {
    setup: function() {
      var tasksRepo = new TasksRepository(dbAPI);
      var tasksService = new TasksService(tasksRepo);
      tasksResource(serverAPI, tasksRepo, tasksService);

      var labelsRepository = new LabelsRepository(dbAPI);
      labelsResource(serverAPI, labelsRepository);
    }
  };
};