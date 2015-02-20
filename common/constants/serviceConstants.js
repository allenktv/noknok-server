function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define('USERNAME', 'username');
define('PASSWORD', 'password');
define('VERIFY', 'verify');