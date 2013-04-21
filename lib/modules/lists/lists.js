var validation = require('perspective-validation');

var setupLists = function(serverAPI, dbAPI) {
  serverAPI.route('get', '/lists', function(req, res, next) {

    console.log(dbAPI);

    res.send(serverAPI);
    next();
  });
};

module.exports = setupLists;