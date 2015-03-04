var AccountHandler = require('./accountHandler');

var usernames = [];

module.exports = function (io, db) {

	var accountHandler = new AccountHandler(db);

	io.on('connection', function (socket) {
		console.log('new connection detected');
		socket.on('send message', function (data, callback) {
			console.log(socket.user.username + ' : ' + data.msg);
			var room = socket.room;
			if (room) {
				io.sockets.in(room).emit('new message', {msg : data, username : socket.user.username});
			} else {
				//error
			}
			if (callback) {
				callback({code: 'success'});
			}
		});	

		socket.on('createUser', function (data, callback) {
			accountHandler.handleCreateUser(data, callback);
			console.dir(data);
			//create user here
			socket.user = data;
			usernames.push(socket.user.username);
			// if (callback) {
			// 	callback(true);
			// }
			io.sockets.emit('usernames', usernames);
		});

		socket.on('join room', function (room) {
			if (socket.room) {
				console.log('leaving room :' + socket.room);
				socket.leave(socket.room);
			}
			socket.room = room;
			socket.join(room);
		});

		socket.on('disconnect', function (data) {
			//remove user
		});

		socket.on('error', function (data) {
			console.dir(data);
		});
	});
};