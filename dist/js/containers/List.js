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

var _actions = require('./../actions/actions.js');

var actionCreators = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = (_dec = (0, _reactRedux.connect)(function (state) {
	return {
		stock: state.stock
	};
}), _dec(_class = function (_Component) {
	_inherits(List, _Component);

	function List(props) {
		_classCallCheck(this, List);

		return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));
	}

	_createClass(List, [{
		key: 'addStockHandler',
		value: function addStockHandler(e) {
			var taken = false;
			this.props.stock.stocks.forEach(function (v) {
				if (e.target.value.toUpperCase() == v.stock.id) taken = true;
			});
			if (e.keyCode === 13 && !taken) {
				actionCreators.lookUpStock(e.target.value, this.props.stock.stocks, this.props.dispatch);
				e.target.value = '';
			}
		}
	}, {
		key: 'removeStockHandler',
		value: function removeStockHandler(e) {
			actionCreators.removeStock(e.currentTarget.getAttribute('data-value'), this.props.dispatch);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(
				'section',
				{ id: 'list' },
				_react2.default.createElement('input', { type: 'text', id: 'input', placeholder: 'Stock symbol here.',
					className: this.props.stock.isFetchFail ? "fail" : "",
					onKeyUp: this.addStockHandler.bind(this),
					disabled: this.props.stock.isFetching }),
				_react2.default.createElement(
					'div',
					{ id: 'symbol-container' },
					this.props.stock.stocks ? this.props.stock.stocks.map(function (e, i) {
						return _react2.default.createElement(
							'div',
							{ key: i, 'data-value': e.stock.id, className: 'symbols',
								onClick: _this2.removeStockHandler.bind(_this2) },
							_react2.default.createElement(
								'h3',
								null,
								e.stock.id
							),
							_react2.default.createElement(
								'p',
								{ className: 'description' },
								e.stock.description.split(' ').slice(0, 3).join(' ')
							)
						);
					}) : []
				)
			);
		}
	}]);

	return List;
}(_react.Component)) || _class);
;

exports.default = List;