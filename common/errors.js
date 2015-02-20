var appConstants = require('./constants/appConstants');
function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value
    });
}

define("INVALID_LOGIN", {
	title: 'Error',
	message: 'Invalid username or password',
	errorCode: '404'
});
define("SHORT_USERNAME", {
	title: 'Error',
	message: 'Username must contain at least ' + appConstants.MINIMUM_USERNAME_LENGTH + ' characters',
	errorCode: '400'
});
define("SHORT_PASSWORD", {
	title: 'Error',
	message: 'Password must contain at least ' + appConstants.MINIMUM_PASSWORD_LENGTH + ' characters',
	errorCode: '400'
});
define("MATCH_PASSWORD", {
	title: 'Error',
	message: 'Passwords do not match',
	errorCode: '400'
});