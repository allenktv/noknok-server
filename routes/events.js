var AccountHandler = require('./accountHandler');

var usernames = [];

module.exports = function (io, db) {

	var accountHandler = new AccountHandler(db);

	io.on('connection', function (socket) {
		socket.on('sendMessage', function (data, callback) {
			console.log(socket.user.username + ' : ' + data.msg);
			var room = socket.room;
			if (room) {
				io.sockets.in(room).emit('newMessage', {msg : data.msg, username : socket.user.username});
			} else {
				//error
			}
		});	

		socket.on('createAccount', function (data, callback) {
			accountHandler.handleCreateAccount(data, function onFinish(err, result) {
				if (err && callback) {
					return callback(err);
				}
				//temporary room joining
				socket.room = 'android';
				socket.join('android');
				socket.user = data;
				usernames.push(socket.user.username);
				io.sockets.emit('usernames', usernames);
				if (callback) {
					callback(result);
				}
			});
		});

		socket.on('loginAccount', function (data, callback) {
			accountHandler.handleLogin(data, function onFinish(err, result) {
				if (err && callback) return callback(err);
				//temporary room joining
				socket.room = 'android';
				socket.join('android');
				//create user here
				socket.user = data;
				usernames.push(socket.user.username);
				io.sockets.emit('usernames', usernames);
				if (callback) {
					callback(result);
				}
			});
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

		//*****TODO******* 
		//Figure out how to do error handling by binding or intercept
		socket.on('error', function (data) {
			console.dir(data);
		});
	});
};