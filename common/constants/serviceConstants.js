function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

//Request parameters
define('ACCOUNT_ID', 'accountId');
define('USERNAME', 'username');
define('PASSWORD', 'password');
define('VERIFY', 'verify');
define('GENDER', 'gender');
define('MESSAGE', 'msg');
define('IS_TYPING', 'isTyping');

//Account
define('CREATE_ACCOUNT', 'createAccount');
define('LOGIN_ACCOUNT', 'loginAccount');
define('GET_ACCOUNT', 'getAccount');
define('DELETE_ACCOUNT', 'deleteAccount');

//Messages
define('CLIENT_MESSAGE', 'clientMessage');
define('SERVER_MESSAGE', 'serverMessage');
define('CLIENT_TYPING', 'clientTyping');
define('SERVER_TYPING', 'serverTyping');