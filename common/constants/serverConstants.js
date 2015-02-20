function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("MONGO_IP", 'mongodb://localhost:27017/noknok');
define("PORT_NUMBER", 8080);

