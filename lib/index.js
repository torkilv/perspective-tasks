var tasksResource = require('./tasks/tasksResource');
var TasksRepository = require('./tasks/tasksRepository');
var TasksService = require('./tasks/tasksService');

var labelsResource = require('./labels/labelsResource');
var Label = require('./labels/label');
var LabelsService = require('./labels/labelsService');

module.exports = function(api) {
  var server = api.server;
  var createRepository = api.createRepository;

  return {
    setup: function() {
      var tasksService = new TasksService(new TasksRepository(createRepository));
      tasksResource(server, tasksService);

      var labelsService = new LabelsService(createRepository('labels', Label));
      labelsResource(server, labelsService);
    }
  };
};