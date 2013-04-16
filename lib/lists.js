module.exports = function(imports, config) {
	var server = imports.server;

	return {
		setup: function() {
			server.get('/lists', function(req, res, next) {
				res.send(config);
				next();
			});
		}
	}
};