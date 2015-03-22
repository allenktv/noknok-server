var ErrorParser = require('../common/errorParser').ErrorParser,
	jsonFactory = require('../helpers/jsonFactory').JsonFactory,
	ServiceConstants = require('../common/constants/serviceConstants'),
	AccountHandler = require('../routes/accountHandler');

function SocketController(io, socket, db) {

	var accountHandler = new AccountHandler(db);

	this.sendMessage = function (message, callback) {
		console.log(socket.user.username + ' : ' + message);
		var room = socket.room;
		if (room) {
			io.sockets.in(room.name).emit(ServiceConstants.SERVER_MESSAGE, 
				{ 'msg' : message, 
				  'username' : socket.user.username 
				});
			return callback(null, jsonFactory.boolean(true));
		} else {
			return callback(jsonFactory.error());
		}
	};

	this.sendTypingEvent = function (isTyping, callback) {
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
			io.sockets.in(room.name).emit(ServiceConstants.SERVER_TYPING, 
				{ 'usernames' : room.usersTyping 
				});
			return callback(null, jsonFactory.boolean(true));
		} else {
			return callback(jsonFactory.error());
		}
	};

	this.createAccount = function (data, callback) {
		accountHandler.handleCreateAccount(data, function onFinish(err, result) {
			if (err) {
				return callback(err);
			} 
			//temporary room joining
			socket.room = {'name' : 'android'};
			socket.join('android');
			socket.user = result.result;
			return callback(null, result);
		});
	};

	this.loginAccount = function (data, callback) {
		accountHandler.handleLogin(data, function onFinish(err, result) {
			if (err) {
				return callback(err);
			} 
			//temporary room joining
			socket.room = {'name' : 'android'};
			socket.join('android');
			socket.user = result.result;
			return callback(null, result);
		});
	};

	this.getAccount = function (data, callback) {
		accountHandler.handleGetAccount(data, function onFinish(err, result) {
			if (err) {
				return callback(err);
			}
			socket.room = {'name' : 'android'};
			socket.join('android');

			socket.user = result.result;
			return callback(null, result);
		});
	};

	this.deleteAccount = function(data, callback) {
		accountHandler.handleDeleteAccount(data, function onFinish(err, result) {
			if (err) {
				return callback(err);
			} 
			if (result) {
				socket.room = null;
				socket.user = null;
				return callback(null, result);
			} else {
				return callback(jsonFactory.error());
			}
		});	
	}

	this.joinRoom = function (room) {
		if (socket.room) {
			console.log('leaving room :' + socket.room.name);
			socket.leave(socket.room.name);
		}
		socket.room = {'name' : room};
		socket.join(room.name);

	};
};

module.exports = SocketController;