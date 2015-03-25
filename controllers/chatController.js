
function ChatController(db) {

	var chats = new ChatDAO(db);

	this.getNewChat = function (data, callback) {
		var location = data[location];

		chats.getNewChat(location, function (err, result) {
			if (callback) {
				if (err) {
					return callback(jsonFactory.error(ErrorParser(err)));
				}
				return callback(null, jsonFactory.chat(result));
			}
		});
	};
};
module.exports = ChatController;