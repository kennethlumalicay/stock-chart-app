var path = process.cwd();
var stocks = require('./../api/stocksApi.js');
var stockFetch = require('./../api/stockFetchApi.js');

module.exports = function (app) {
	app.route('/api/stocks')
		.get(function (req, res) {
			stocks(req.query, res);
		});
	app.route('/api/stockFetch/search')
		.get(function (req, res) {
			stockFetch.search(req.query, e => res.send(e));
		});
	app.route('/api/stockFetch/data')
		.get(function (req, res) {
			stockFetch.data(req.query, e => res.send(e));
		});
};
