var ErrorParser = require('../common/errorParser').ErrorParser,
	jsonFactory = require('../helpers/jsonFactory').JsonFactory,
	ServiceConstants = require('../common/constants/serviceConstants');

function SocketController(io, socket) {

	this.sendMessage = function (message, callback) {
		console.log(socket.user.username + ' : ' + message);
		var room = socket.room;
		if (room) {
			io.sockets.in(room.name).emit(ServiceConstants.SERVER_MESSAGE, 
				{ 'msg' : message, 
				  'username' : socket.user.username 
				});
			callback(null, jsonFactory.boolean(true));
		} else {
			callback(jsonFactory.error());
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
		} else {
			callback(jsonFactory.error());
		}
	}
};

module.exports = SocketController;