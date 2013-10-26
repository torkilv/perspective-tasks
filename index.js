var tasksResource = require('./lib/tasks/tasksResource');
var TasksRepository = require('./lib/tasks/tasksRepository');
var TasksService = require('./lib/tasks/tasksService');

var labelsResource = require('./lib/labels/labelsResource');
var Label = require('./lib/labels/label');
var LabelsService = require('./lib/labels/labelsService');

var coreRest = require('perspective-core-rest');
var coreDb = require('perspective-core-db');

var env = process.env;

var serverConfig = coreRest.produceConfig(env);
var dbConfig = coreDb.produceConfig(env);

coreDb.db(dbConfig).then(function(db) {
  var server = coreRest.createServer(serverConfig);

  var tasksService = new TasksService(new TasksRepository(db.api));
  tasksResource(server.api, tasksService);

  var labelsService = new LabelsService(db.api('labels', Label));
  labelsResource(server.api, labelsService);
}).fail(function(error) {
  console.error(error);
  process.exit(1);
});



