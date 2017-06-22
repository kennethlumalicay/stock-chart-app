'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getAllStockData = getAllStockData;
exports.getStockData = getStockData;
exports.addStock = addStock;
exports.lookUpStock = lookUpStock;
exports.removeStock = removeStock;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAllStockData(stocks, dispatch) {
	dispatch({ type: 'FETCHING_DATA' });
	var promises = [];
	stocks.forEach(function (e, i) {
		promises.push((0, _axios2.default)({
			url: '/api/stockFetch/data',
			params: {
				search: e.stock.id
			}
		}));
	});
	_axios2.default.all(promises).then(function (res) {
		res.data.forEach(function (e, i) {
			stocks[i].stock.data = e.data;
		});
		dispatch({ type: 'server/ADD_STOCK_DATA', payload: stocks });
	}).catch(function (err) {
		console.log('Failed to fetch all data. It is possible that the', 'request limit has been achieved. Please try again later.');
		console.log(err);
		dispatch({ type: 'FETCH_FAIL' });
	});
}

function getStockData(search, desc) {
	var stocks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	var added = arguments[3];
	var dispatch = arguments[4];

	(0, _axios2.default)({
		url: '/api/stockFetch/data',
		params: {
			search: search
		}
	}).then(function (res) {
		var temp = {
			stock: {
				id: search.toUpperCase(),
				description: desc,
				data: res.data
			}
		};
		if (added) stocks.push(temp);else stocks[stocks.length - 1] = temp;
		dispatch({ type: 'FETCH_DONE' });
		dispatch({ type: 'server/ADD_STOCK_DATA', payload: stocks });
	}).catch(function (err) {
		dispatch({ type: 'FETCH_FAIL' });
		console.log(err);
	});
}

function addStock(id, description, prev, dispatch) {
	(0, _axios2.default)({
		url: '/api/stocks',
		params: {
			id: id,
			desc: description,
			action: 'add'
		}
	}).then(function (res) {
		dispatch({ type: 'ADDED_TO_DB' });
		getStockData(id, description, prev, res.data.length != prev.length, dispatch);
		//getAllStockData(res.data, dispatch);
	}).catch(function (err) {
		console.log(err);
		dispatch({ type: 'FETCH_FAIL' });
		dispatch({ type: 'ADD_STOCK_FAIL' });
	});
}

function lookUpStock(search, stocks, dispatch) {
	dispatch({ type: 'FETCHING_DATA' });
	(0, _axios2.default)({
		url: '/api/stockFetch/search',
		params: {
			search: search
		}
	}).then(function (res) {
		var id = res.data.dataset.dataset_code;
		var description = res.data.dataset.name;
		addStock(id, description, stocks, dispatch);
	}).catch(function (err) {
		dispatch({ type: 'FETCH_FAIL' });
		dispatch({ type: 'LOOKUP_FAIL' });
	});
}

function removeStock(id, dispatch) {
	(0, _axios2.default)({
		url: '/api/stocks',
		params: {
			id: id,
			action: 'remove'
		}
	}).then(function (res) {
		dispatch({ type: 'server/REMOVE_STOCK', payload: id });
	}).catch(function (err) {
		console.log(err);
		dispatch({ type: 'REMOVE_STOCK_FAIL' });
	});
}