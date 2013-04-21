var setupTasks = require('./modules/tasks/tasks');

module.exports = function(imports, config) {
  var serverAPI = imports.server;
  var dbAPI = imports.db;

  return {
    setup: function() {
      setupTasks(serverAPI, dbAPI);
    }
  };
};