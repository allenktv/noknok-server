var AccountHandler = require('./accountHandler'),
	ServiceConstants = require('../common/constants/serviceConstants');

module.exports = function (io, db) {

	var accountHandler = new AccountHandler(db);

	io.on('connection', function (socket) {
		console.log('connection detected\n');

		socket.on(ServiceConstants.CLIENT_MESSAGE, function (data, callback) {
			console.log(socket.user.username + ' : ' + data[ServiceConstants.MESSAGE]);
			var room = socket.room;
			if (room) {
				io.sockets.in(room.name).emit(ServiceConstants.SERVER_MESSAGE, 
					{ 'msg' : data[ServiceConstants.MESSAGE], username : socket.user.username });
			} else {
				//error
			}
		});	

		socket.on(ServiceConstants.CLIENT_TYPING, function (data, callback) {
			var isTyping = parseInt(data[ServiceConstants.IS_TYPING]);
			var room = socket.room;
			if (room) {
				if (!room.hasOwnProperty('usersTyping')) {
					room.usersTyping = [];
				}
				var index = room.usersTyping.indexOf(socket.user.username);
				if (isTyping && index == -1) {
					room.usersTyping.push(socket.user.username);
				} else if (!isTyping && index > -1) {
					room.usersTyping.splice(index, 1);
				}
				io.sockets.in(room.name).emit(ServiceConstants.SERVER_TYPING, { 'usernames' : room.usersTyping });
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
				socket.room = {'name' : 'android'};
				socket.join('android');
				socket.user = result.result;
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
				socket.room = {'name' : 'android'};
				socket.join('android');
				//create user here
				socket.user = result.result;
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
				socket.room = {'name' : 'android'};
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
				console.log('leaving room :' + socket.room.name);
				socket.leave(socket.room.name);
			}
			socket.room = {'name' : room};
			socket.join(room.name);
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