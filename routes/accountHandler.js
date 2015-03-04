var AccountDAO = require('../dao/accountDAO').AccountDAO,
	jsonFactory = require('../helpers/jsonFactory').JsonFactory,
	ServiceConstants = require('../common/constants/serviceConstants'), 
	AccountBO = require('../bo/accountBO').AccountBO,
    ErrorParser = require('../common/errorParser').ErrorParser;

function AccountHandler(db) {

	var accounts = new AccountDAO(db);

	this.handleCreateUser = function (data, callback) {
		var username = data[ServiceConstants.USERNAME];
		var password = data[ServiceConstants.PASSWORD];
		var verify = data[ServiceConstants.VERIFY];

		var validateErr = AccountBO.validateCreateAccount(username, password, verify);
		if (validateErr) return callback(jsonFactory.error(validateErr));

		accounts.createAccount(username, password, function (err, result) {
			if (err) {
				return callback(jsonFactory.error(ErrorParser(err)));
			}
			return callback(jsonFactory.account(result));
		});
	};

	this.handleLogin = function (data, callback) {
		var username = data[ServiceConstants.USERNAME];
		var password = data[ServiceConstants.PASSWORD];

		accounts.login(username, password, function (err, user) {
			if (err) {
				return callback(jsonFactory.error(ErrorParser(err)));
			}
			return callback(jsonFactory.account(user));
		});
	};
};
module.exports = AccountHandler;