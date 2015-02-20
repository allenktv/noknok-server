var ServiceConstants = require('../common/constants/serviceConstants'),
    AccountBO = require('../bo/accountBO');
    Account = require('../models/account').Account,
    Errors = require('../common/errors');

function AccountDAO(db) {

	var accounts = db.collection('accounts');

	this.createAccount = function (username, password, callback) {
        var newAccount = new Account({username : username, password : password});
        newAccount.save(function (err, account) {
            if (err) 
                return callback(err);
            return callback(null, account);
        });
	}

	this.login = function(username, password, callback) {
        Account.findOne({username : username}, function (err, account) {
            if (err) 
                return callback(err);
            if (account) {
                account.comparePassword(password, function(err, isMatch) {
                    if (err) 
                        return callback(err);
                    if (isMatch) {
                        return callback(null, account);
                    } else {
                        return callback(Errors.INVALID_LOGIN);
                    }
                });
            }
            else 
                return callback(Errors.INVALID_LOGIN);
        });
    }
}
module.exports.AccountDAO = AccountDAO;