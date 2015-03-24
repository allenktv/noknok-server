var AccountDAO = require('../dao/accountDAO').AccountDAO,
	jsonFactory = require('../helpers/jsonFactory').JsonFactory,
	ServiceConstants = require('../common/constants/serviceConstants'), 
	AccountBO = require('../bo/accountBO').AccountBO,
    ErrorParser = require('../common/errorParser').ErrorParser;

function AccountController(db) {

	var accounts = new AccountDAO(db);

	this.createAccount = function (data, callback) {
		var username = data[ServiceConstants.USERNAME];
		var password = data[ServiceConstants.PASSWORD];

		var validateErr = AccountBO.validateCreateAccount(username, password);
		if (validateErr) {
			return callback(jsonFactory.error(validateErr));
		}
		accounts.createAccount(username, password, function (err, result) {
			if (callback) {
				if (err) {
					return callback(jsonFactory.error(ErrorParser(err)));
				}
				return callback(null, jsonFactory.account(result));
			}
		});
	};

	this.loginAccount = function (data, callback) {
		var username = data[ServiceConstants.USERNAME];
		var password = data[ServiceConstants.PASSWORD];

		accounts.login(username, password, function (err, account) {
			if (callback) {
				if (err) {
					return callback(jsonFactory.error(ErrorParser(err)));
				}
				return callback(null, jsonFactory.account(account));
			}
		});
	};

	this.deleteAccount = function (data, callback) {
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

	this.getAccount = function (data, callback) {
		var accountId = data[ServiceConstants.ACCOUNT_ID];

		accounts.getAccount(accountId, function (err, account) {
			if (callback) {
				if (err) {
					return callback(jsonFactory.error(ErrorParser(err)));
				}
				return callback(null, jsonFactory.account(account));
			}
		});
	}
};
module.exports = AccountController;