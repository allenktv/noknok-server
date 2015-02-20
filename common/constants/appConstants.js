function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define('MINIMUM_USERNAME_LENGTH', 5);
define('MAXIMUM_USERNAME_LENGTH', 40);
define('MINIMUM_PASSWORD_LENGTH', 5);