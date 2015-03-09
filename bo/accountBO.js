var AppConstants = require('../common/constants/appConstants'),
	Errors = require('../common/errors');

module.exports.AccountBO = {

	validateCreateAccount : function (username, password) {
		if (username.length < AppConstants.MINIMUM_USERNAME_LENGTH) {
			return Errors.SHORT_USERNAME;
		}
		if (password.length < AppConstants.MINIMUM_PASSWORD_LENGTH) {
			return Errors.SHORT_PASSWORD;
		}
		return null;
	}
}