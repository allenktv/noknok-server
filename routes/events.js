var AccountHandler = require('./accountHandler');

var usernames = [];

module.exports = function (io, db) {

	var accountHandler = new AccountHandler(db);

	io.on('connection', function (socket) {
		console.log('new connection detected');
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

		socket.on('error', function (data) {
			console.dir(data);
		});
	});
};