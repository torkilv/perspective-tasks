var tasksResource = require('./modules/tasks/tasksResource'),
  TasksRepository = require('./modules/tasks/tasksRepository'),
  TasksService = require('./modules/tasks/tasksService'),
  labelsResource = require('./modules/labels/labelsResource'),
  LabelsRepository = require('./modules/labels/labelsRepository');

module.exports = function(api) {
  var serverAPI = api.server;
  var dbAPI = api.db;

  return {
    setup: function() {
      var tasksService = new TasksService(new TasksRepository(dbAPI));
      tasksResource(serverAPI, tasksService);

      var labelsRepository = new LabelsRepository(dbAPI);
      labelsResource(serverAPI, labelsRepository);
    }
  };
};