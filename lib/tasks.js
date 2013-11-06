var tasksResource = require('./tasks/tasks-resource');
var TasksRepository = require('./tasks/tasks-repository');
var TasksService = require('./tasks/tasks-service');

var labelsResource = require('./labels/labels-resource');
var Label = require('./labels/label');
var LabelsService = require('./labels/labels-service');

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