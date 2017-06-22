var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
	stock: {
		id: String,
		description: String
	}
}, {collection: 'stocks'});

module.exports = mongoose.model('Stock', Stock);