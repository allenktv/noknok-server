var AccountHandler = require('./accountHandler'),
	ServiceConstants = require('../common/constants/serviceConstants');

var usernames = [];
var usersTyping = [];

module.exports = function (io, db) {

	var accountHandler = new AccountHandler(db);

	io.on('connection', function (socket) {
		console.log('connection detected\n');

		socket.on(ServiceConstants.CLIENT_MESSAGE, function (data, callback) {
			console.log(socket.user.username + ' : ' + data[ServiceConstants.MESSAGE]);
			var room = socket.room;
			if (room) {
				io.sockets.in(room).emit(ServiceConstants.SERVER_MESSAGE, 
					{ 'msg' : data[ServiceConstants.MESSAGE], username : socket.user.username });
			} else {
				//error
			}
		});	

		socket.on(ServiceConstants.CLIENT_TYPING, function (data, callback) {
			var isTyping = data[ServiceConstants.IS_TYPING];\
			var index = usersTyping.indexOf(socket.user.username);
			if (isTyping && index == -1) {
				usersTyping.push(socket.user.username);
			} else if (!isTyping && index > -1) {
				usersTyping.splice(index, 1);
			}
			var room = socket.room;
			if (room) {
				io.sockets.in(room).emit(ServiceConstants.SERVER_TYPING, 
					{ 'usernames' : usersTyping });
			} else {
				//error
			}
		});

		socket.on(ServiceConstants.CREATE_ACCOUNT, function (data, callback) {
			accountHandler.handleCreateAccount(data, function onFinish(err, result) {
				if (err) {
					if (callback) {
						return callback(err);
					}
					return;
				} 
				//temporary room joining
				socket.room = 'android';
				socket.join('android');
				socket.user = result.result;
				usernames.push(socket.user.username);
				io.sockets.emit('usernames', usernames);
				if (callback) {
					callback(result);
				}
			});
		});

		socket.on(ServiceConstants.LOGIN_ACCOUNT, function (data, callback) {
			accountHandler.handleLogin(data, function onFinish(err, result) {
				if (err) {
					if (callback) {
						return callback(err);
					}
					return;
				} 
				//temporary room joining
				socket.room = 'android';
				socket.join('android');
				//create user here
				socket.user = result.result;
				usernames.push(socket.user.username);
				io.sockets.emit('usernames', usernames);
				if (callback) {
					callback(result);
				}
			});
		});

		socket.on(ServiceConstants.GET_ACCOUNT, function (data, callback) {
			accountHandler.handleGetAccount(data, function onFinish(err, result) {
				if (err) {
					if (callback) {
						return callback(err);
					}
					return;
				}
				socket.room = 'android';
				socket.join('android');

				socket.user = result.result;
				if (callback) {
					callback(result);
				}
			});
		});

		socket.on(ServiceConstants.DELETE_ACCOUNT, function (data, callback) {
			accountHandler.handleDeleteAccount(data, function onFinish(err, result) {
				if (err) {
					if (callback) {
						return callback(err);
					}
					return;
				} 
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
			console.log('socket disconnected\n');
			console.dir(data);
		});

		//*****TODO******* 
		//Figure out how to do error handling by binding or intercept
		socket.on('error', function (data) {
			console.dir("error detected " + data);
		});
	});
};