var AccountDAO = require('../dao/accountDAO').AccountDAO,
	jsonFactory = require('../helpers/jsonFactory').JsonFactory,
	ServiceConstants = require('../common/constants/serviceConstants'), 
	AccountBO = require('../bo/accountBO').AccountBO,
    ErrorParser = require('../common/errorParser').ErrorParser;

function AccountHandler(db) {

	var accounts = new AccountDAO(db);

	this.handleCreateAccount = function (data, callback) {
		var username = data[ServiceConstants.USERNAME];
		var password = data[ServiceConstants.PASSWORD];

		var validateErr = AccountBO.validateCreateAccount(username, password);
		if (validateErr) 
			return callback(jsonFactory.error(validateErr));
		accounts.createAccount(username, password, function (err, result) {
			if (callback) {
				if (err) {
					return callback(jsonFactory.error(ErrorParser(err)));
				}
				return callback(null, jsonFactory.account(result));
			}
		});
	};

	this.handleLogin = function (data, callback) {
		var username = data[ServiceConstants.USERNAME];
		var password = data[ServiceConstants.PASSWORD];

		accounts.login(username, password, function (err, user) {
			if (callback) {
				if (err) {
					return callback(jsonFactory.error(ErrorParser(err)));
				}
				return callback(null, jsonFactory.account(user));
			}
		});
	};

	this.handleDeleteAccount = function (data, callback) {
		var username = data[ServiceConstants.USERNAME];

		accounts.deleteAccount(username, function (err, success) {
			if (callback) {
				if (err) {
					return callback(jsonFactory.error(ErrorParser(err)));
				}
				return callback(null, jsonFactory.boolean(success));
			}
		});
	}
};
module.exports = AccountHandler;