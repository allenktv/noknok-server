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

//Account
define('CREATE_ACCOUNT', 'createAccount');
define('LOGIN_ACCOUNT', 'loginAccount');
define('GET_ACCOUNT', 'getAccount');
define('DELETE_ACCOUNT', 'deleteAccount');

//Messages
define('SEND_MESSAGE', 'sendMessage');
define('NEW_MESSAGE', 'newMessage');