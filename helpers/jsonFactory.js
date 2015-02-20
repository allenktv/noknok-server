module.exports.JsonFactory =  {

	boolean : function (success) {
		var result = {
			"result" : {
				"success" : success ? 1 : 0
			}
		};
		return result;
	},

	account : function (account) {
		var result = {
			"result" : {
				"id" : account._id,
				"username" : account.username
			}
		};
		return result;
	},

	error : function(err) {
		var error = {
			"error" : {
				"title" : "Error",
				"message" : err != null ? err.message : "An error has occured",
				"errorCode" : err != null ? err.errorCode : 500
			}
		};
		return error;
	}
}