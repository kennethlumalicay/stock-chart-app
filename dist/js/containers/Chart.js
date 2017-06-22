'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _chart = require('chart.js');

var _chart2 = _interopRequireDefault(_chart);

var _actions = require('./../actions/actions.js');

var actionCreators = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = (_dec = (0, _reactRedux.connect)(function (state) {
	return {
		stock: state.stock
	};
}), _dec(_class = function (_Component) {
	_inherits(Chart, _Component);

	function Chart(props) {
		_classCallCheck(this, Chart);

		var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));

		_this.drawChart = _this.drawChart.bind(_this);
		var stockChart;
		var drawn;
		return _this;
	}

	_createClass(Chart, [{
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.drawChart();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.drawChart();
		}
	}, {
		key: 'drawChart',
		value: function drawChart() {
			if (this.props.stock.stocks.length) {
				if (this.props.stock.stocks[0].stock.data) {
					var colors = ['rgb(255,0,0)', 'rgb(255,0,255)', 'rgb(255,255,0)', 'rgb(0,255,255)', 'rgb(155,0,0)', 'rgb(155,0,155)', 'rgb(155,155,0)', 'rgb(0,155,155)', 'rgb(100,0,0)', 'rgb(100,0,100)', 'rgb(100,100,0)', 'rgb(0,100,100)', 'rgb(50,0,0)', 'rgb(50,0,50)', 'rgb(50,50,0)'];
					var temp = [].concat(_toConsumableArray(this.props.stock.stocks));
					var labels = temp.sort(function (a, b) {
						return a.stock.data.length + b.stock.data.length;
					})[0].stock.data.map(function (e) {
						return e[0];
					});
					var datasets = temp.map(function (e, i) {
						return {
							label: e.stock.id,
							borderColor: colors[i],
							borderWidth: 1,
							pointRadius: 0,
							data: e.stock.data.map(function (e) {
								return e[1];
							})
						};
					});
					var ctx = this.refs.lineChart;
					this.stockChart = new _chart2.default(ctx, {
						type: 'line',
						data: {
							labels: labels,
							datasets: datasets
						},
						options: {
							tooltips: {
								mode: 'index',
								intersect: false
							},
							legend: {
								position: 'bottom'
							}
						}
					});
					this.drawn = true;
				} else console.log('Stocks has no data.');
			} else console.log('Stocks does not exist.');
		}
	}, {
		key: 'fetchData',
		value: function fetchData() {
			actionCreators.getAllStockData(this.props.stock.stocks, this.props.dispatch);
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.stockChart) this.stockChart.destroy();
			return _react2.default.createElement(
				'section',
				{ id: 'chart', ref: 'chart' },
				this.drawn ? _react2.default.createElement('canvas', { id: 'lineChart', ref: 'lineChart' }) : _react2.default.createElement(
					'button',
					{ id: 'fetch-btn', onClick: this.fetchData.bind(this),
						disabled: this.props.stock.isFetching },
					'Fetch data'
				)
			);
		}
	}]);

	return Chart;
}(_react.Component)) || _class);
;

exports.default = Chart;