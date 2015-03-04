var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
	username : { type: String, required: true, trim: true, index : { unique : true } },
	msg : { type: String, required: true }
});

exports.Message = mongoose.model('Message', MessageSchema);