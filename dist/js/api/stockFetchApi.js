'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.data = data;
exports.search = search;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function data(query, cb) {
	var url = process.env.API_URL_SEARCH + 'WIKI/' + query.search + '.json';
	// get startDate yyyy-mm-dd format
	var today = new Date();
	var mm = today.getMonth() - 2;
	var dd = today.getDate();
	var startDate = today.getFullYear() - 1 + (mm > 9 ? '-' : '-0') + (mm < 1 ? mm + 12 : mm) + (dd > 9 ? '-' : '-0') + dd;

	(0, _axios2.default)({
		url: url,
		params: {
			api_key: process.env.API_KEY,
			column_index: 4,
			collapse: 'weekly',
			start_date: startDate,
			order: 'asc'
		}
	}).then(function (res) {
		cb(res.data.dataset.data);
	}).catch(function (err) {
		console.log('Failed to get', query.search, 'from STOCK FETCH DATA.');
		cb(null);
	});
}

function search(query, cb) {
	var url = process.env.API_URL_SEARCH + 'WIKI/' + query.search + '/metadata.json';
	(0, _axios2.default)({
		url: url,
		params: {
			api_key: process.env.API_KEY
		}
	}).then(function (res) {
		cb(res.data);
	}).catch(function (err) {
		console.log('Failed to get', query.search, 'from STOCK FETCH SEARCH.');
		cb(null);
	});
}