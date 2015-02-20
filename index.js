var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	routes = require('./routes/routes'),
	constants = require('./common/constants/serverConstants');

mongoose.connect(constants.MONGO_IP, function (err) {
	if (err) throw err;

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	routes(app, mongoose.connection);

	var server = app.listen(constants.PORT_NUMBER, function() {
		console.log('Express server listening on port ' + server.address().port);
	});
});