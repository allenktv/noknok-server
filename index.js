var http = require('http'),
	app = require('express')(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	routes = require('./routes/routes'),
	constants = require('./common/constants/serverConstants');

var usernames = [];

mongoose.connect(constants.MONGO_IP, function (err) {
	if (err) throw err;

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	routes(app, mongoose.connection);

	server.listen(constants.PORT_NUMBER, function() {
		console.log('Express server listening on port ' + constants.PORT_NUMBER);
	});

	app.get('/', function (req, res) {
  		res.sendFile(__dirname + '/test.html');
	});

	io.on('connection', function (socket) {
		console.log('connection detected');
		socket.on('send message', function (data, callback) {
			console.log(socket.user.username + ' : ' + data);
			io.sockets.emit('new message', {msg : data, username : socket.user.username});
			if (callback) {
				callback({code: 'success'});
			}
		});

		socket.on('createUser', function (data, callback) {
			console.dir(data);
			//create user here
			socket.user = data;
			usernames.push(socket.user.username);
			if (callback) {
				callback(true);
			}
			io.sockets.emit('usernames', usernames);
		});

		socket.on('disconnect', function (data) {
			//remove user
		});
	});
});