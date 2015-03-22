var	ServiceConstants = require('../common/constants/serviceConstants'),
	SocketController = require('../controllers/socketController');

module.exports = function (io, db) {

	io.on('connection', function (socket) {

		var socketController = new SocketController(io, db, socket);

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
			socketController.sendTypingEvent(isTyping, function (err, result) {
				if (callback) {
					if (err) {
						return callback(err);
					} 
					return callback(result);
				}
			});
		});

		socket.on(ServiceConstants.CREATE_ACCOUNT, function (data, callback) {
			socketController.createAccount(data, function (err, result) {
				if (callback) {
					if (err) {
						return callback(err);
					} 
					return callback(result);
				}
			});
		});

		socket.on(ServiceConstants.LOGIN_ACCOUNT, function (data, callback) {
			socketController.loginAccount(data, function (err, result) {
				if (callback) {
					if (err) {
						return callback(err);
					} 
					return callback(result);
				}
			});
		});

		socket.on(ServiceConstants.GET_ACCOUNT, function (data, callback) {
			socketController.getAccount(data, function (err, result) {
				if (callback) {
					if (err) {
						return callback(err);
					} 
					return callback(result);
				}
			});
		});

		socket.on(ServiceConstants.DELETE_ACCOUNT, function (data, callback) {
			socketController.deleteAccount(data, function (err, result) {
				if (callback) {
					if (err) {
						return callback(err);
					} 
					return callback(result);
				}
			});
		});

		socket.on('join room', function (room) {
			socketController.joinRoom(room);
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