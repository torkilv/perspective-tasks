var tasksResource = require('./lib/tasks/tasksResource');
var TasksRepository = require('./lib/tasks/tasksRepository');
var TasksService = require('./lib/tasks/tasksService');

var labelsResource = require('./lib/labels/labelsResource');
var Label = require('./lib/labels/label');
var LabelsService = require('./lib/labels/labelsService');

module.exports = function(api) {
  var server = api.restServer;
  var createRepository = api.db;

  return {
    setup: function() {
      var tasksService = new TasksService(new TasksRepository(createRepository));
      tasksResource(server, tasksService);

      var labelsService = new LabelsService(createRepository('labels', Label));
      labelsResource(server, labelsService);
    }
  };
};