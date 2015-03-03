var http = require('http'),
	app = require('express')(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	routes = require('./routes/routes'),
	events = require('./routes/events'),
	constants = require('./common/constants/serverConstants');

mongoose.connect(constants.MONGO_IP, function (err) {
	if (err) throw err;

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	routes(app, mongoose.connection);
	events(io, mongoose.connection);

	server.listen(constants.PORT_NUMBER, function() {
		console.log('Express server listening on port ' + constants.PORT_NUMBER);
	});

	//For web testing
	app.get('/', function (req, res) {
  		res.sendFile(__dirname + '/test.html');
	});
});