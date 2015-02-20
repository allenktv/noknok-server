var Errors = require('./errors');

module.exports.ErrorParser = function(err) {
	console.dir(err);

	switch(err.code) {
		case 11000:
			return Errors.USERNAME_EXISTS;
		default:
			return Errors.UNSPECIFIED_ERROR;
	}
}