var ServiceConstants = require('../common/constants/serviceConstants'),
    Errors = require('../common/errors');

function ChatDAO(db) {

	var chats = db.collection('chats');

	this.getNewAccount = function (location, callback) {
        // var newAccount = new Account({'username' : username, 'password' : password});
        // newAccount.save(function (err, account) {
        //     if (err) {
        //         return callback(err);
        //     }
        //     return callback(null, account);
        // });
	};

}
module.exports.ChatDAO = ChatDAO;