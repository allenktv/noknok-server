var AccountHandler = require('./accountHandler'),
	errorHandler = require('./errorHandler').errorHandler;

module.exports = function (app, db) {

	var accountHandler = new AccountHandler(db);
	
	//Account functions
	app.post('/account/create', accountHandler.handleCreateUser);
	app.post('/account/login', accountHandler.handleLogin);

	//Error 
	app.use(errorHandler); 
};