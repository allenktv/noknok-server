var ErrorParser = require('../common/errorParser').ErrorParser,
	jsonFactory = require('../helpers/jsonFactory').JsonFactory,
	ServiceConstants = require('../common/constants/serviceConstants'),
	AccountController = require('../controllers/accountController');;

function SocketController(io, db, socket) {

	var accountController = new AccountController(db);

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
		accountController.createAccount(data, function onFinish(err, result) {
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
		accountController.loginAccount(data, function onFinish(err, result) {
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
		accountController.getAccount(data, function onFinish(err, result) {
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
		accountController.deleteAccount(data, function onFinish(err, result) {
			if (err) {
				return callback(err);
			} 
			if (result) {
				removeSocketUserInfo();
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

	function removeSocketUserInfo() {
		socket.room = null;
		socket.user = null;
	};
};


module.exports = SocketController;