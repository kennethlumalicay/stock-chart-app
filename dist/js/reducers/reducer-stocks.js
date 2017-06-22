'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var action = arguments[1];

    switch (action.type) {
        case 'FETCHING_DATA':
            return Object.assign({}, state, {
                isFetching: true,
                isFetchFail: false,
                search: ''
            });
            break;
        case 'FETCH_DONE':
        case 'FETCH_FAIL':
            return Object.assign({}, state, {
                isFetching: false
            });
            break;
        case 'CLIENT_ADD_STOCK':
            return Object.assign({}, state, {
                stocks: action.payload,
                isFetchFail: false
            });
            break;
        case 'ADD_STOCK_DATA':
            return Object.assign({}, state, {
                stocks: action.payload
            });
            break;
        case 'CLIENT_REMOVE_STOCK':
            return Object.assign({}, state, {
                stocks: state.stocks.filter(function (e) {
                    return e.stock.id !== action.payload;
                }),
                isFetchFail: false
            });
            break;
        case 'ADD_STOCK_FAIL':
            return Object.assign({}, state, {
                isFetchFail: true
            });
            break;
        case 'REMOVE_STOCK_FAIL':
            return state;
            break;
    }
    return state;
};