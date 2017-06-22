'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _reducerStocks = require('./reducer-stocks');

var _reducerStocks2 = _interopRequireDefault(_reducerStocks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allReducers = (0, _redux.combineReducers)({
    stock: _reducerStocks2.default
});

exports.default = allReducers;