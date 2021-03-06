var http = require('http'),
	app = require('express')(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	eventRouter = require('./routes/eventRouter'),
	constants = require('./common/constants/serverConstants');

mongoose.connect(constants.MONGO_IP, function (err) {
	if (err) throw err;
	
	eventRouter(io, mongoose.connection);

	server.listen(constants.PORT_NUMBER, function() {
		console.log('Express server listening on port ' + constants.PORT_NUMBER);
	});

	//For web testing
	app.get('/', function (req, res) {
  		res.sendFile(__dirname + '/test.html');
	});
});