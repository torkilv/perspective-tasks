var tasksResource = require('./tasks/tasksResource');
var TasksRepository = require('./tasks/tasksRepository');
var TasksService = require('./tasks/tasksService');

var labelsResource = require('./labels/labelsResource');
var Label = require('./labels/label');
var LabelsService = require('./labels/labelsService');

var coreRest = require('perspective-core-rest');
var coreDb = require('perspective-core-db');

module.exports = function(env) {
	var serverConfig = coreRest.produceConfig(env);
	var dbConfig = coreDb.produceConfig(env);

	coreDb.db(dbConfig).then(function(createRepository) {
	  var server = coreRest.createServer(serverConfig);

	  var tasksService = new TasksService(new TasksRepository(createRepository));
	  tasksResource(server, tasksService);

	  var labelsService = new LabelsService(createRepository('labels', Label));
	  labelsResource(server, labelsService);
	}).fail(function(error) {
	  console.error(error);
	  process.exit(1);
	});
};