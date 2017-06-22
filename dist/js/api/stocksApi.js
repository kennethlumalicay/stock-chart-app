'use strict';

var Stocks = require('./../models/stocks.js');

// takes query.action and query.id
module.exports = function (query, response) {
	if (query.action == 'add') {
		Stocks.find({ 'stock.id': query.id }, function (err, data) {
			if (err) console.log(err);
			if (!data.length) {
				Stocks.create({ stock: { id: query.id, description: query.desc } }, function (err) {
					if (err) console.log(err);
					done(response);
				});
			} else {
				done(response);
			}
		});
	} else if (query.action == 'remove') {
		Stocks.remove({ 'stock.id': query.id }, function (err) {
			if (err) console.log(err);
			done(response);
		});
	}
};

function done(res) {
	Stocks.find(function (err, data) {
		if (err) console.log(err);
		res.send(data);
	});
}