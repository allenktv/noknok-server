var AccountDAO = require('../dao/accountDAO').AccountDAO,
	jsonFactory = require('../helpers/jsonFactory').JsonFactory,
	ServiceConstants = require('../common/constants/serviceConstants'), 
	AccountBO = require('../bo/accountBO').AccountBO,
    ErrorParser = require('../common/errorParser').ErrorParser;

function AccountHandler(db) {

	var accounts = new AccountDAO(db);

	this.handleCreateUser = function (req, res, next) {
		var username = req.body[ServiceConstants.USERNAME];
		var password = req.body[ServiceConstants.PASSWORD];
		var verify = req.body[ServiceConstants.VERIFY];

		var validateErr = AccountBO.validateCreateAccount(username, password, verify);
		if (validateErr) return res.json(jsonFactory.error(validateErr));

		accounts.createAccount(username, password, function (err, result) {
			if (err) {
				return res.json(jsonFactory.error(ErrorParser(err)));
			}
			return res.json(jsonFactory.account(result));
		});
	};

	this.handleLogin = function (req, res, next) {
		var username = req.body[ServiceConstants.USERNAME];
		var password = req.body[ServiceConstants.PASSWORD];

		accounts.login(username, password, function (err, user) {
			if (err) {
				return res.json(jsonFactory.error(ErrorParser(err)));
			}
			return res.json(jsonFactory.account(user));
		});
	};
};
module.exports = AccountHandler;