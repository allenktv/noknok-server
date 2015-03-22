var AccountHandler = require('./accountHandler'),
	ServiceConstants = require('../common/constants/serviceConstants'),
	SocketController = require('../controllers/socketController');

module.exports = function (io, db) {

	var accountHandler = new AccountHandler(db);

	io.on('connection', function (socket) {

		var socketController = new SocketController(io, socket);

		socket.on(ServiceConstants.CLIENT_MESSAGE, function (data, callback) {
			socketController.sendMessage(data[ServiceConstants.MESSAGE], function (err, result) {
				if (callback) {
					if (err) {
						return callback(err);
					} 
					return callback(result);
				}
			});
		});	

		socket.on(ServiceConstants.CLIENT_TYPING, function (data, callback) {
			var isTyping = parseInt(data[ServiceConstants.IS_TYPING]);
			socketController.sendTypingEvent(isTyping, function (err, callback) {
				if (callback) {
					if (err) {
						return callback(err);
					} 
					return callback(result);
				}
			});
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