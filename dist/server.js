'use strict';

require('babel-polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _server = require('react-dom/server');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _App = require('./js/components/App.js');

var _App2 = _interopRequireDefault(_App);

var _store = require('./store.js');

var _store2 = _interopRequireDefault(_store);

var _index = require('./js/routes/index.js');

var _index2 = _interopRequireDefault(_index);

var _stocks = require('./js/models/stocks.js');

var _stocks2 = _interopRequireDefault(_stocks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoStore = require('connect-mongo')(_expressSession2.default);
require('dotenv').load();

// File imports


// Init
var app = (0, _express2.default)();
_mongoose2.default.connect(process.env.MONGO_URI);
_mongoose2.default.Promise = global.Promise;

// Session
app.use((0, _expressSession2.default)({
  secret: 'secretKLM',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: _mongoose2.default.connection })
}));

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.enable('trust proxy');

// Static
app.use('/actions', _express2.default.static(process.cwd() + './js/actions'));
app.use('/components', _express2.default.static(process.cwd() + './js/components'));
app.use('/config', _express2.default.static(process.cwd() + './js/config'));
app.use('/containers', _express2.default.static(process.cwd() + './js/containers'));
app.use('/models', _express2.default.static(process.cwd() + './js/models'));
app.use('/reducers', _express2.default.static(process.cwd() + './js/reducers'));
app.use('/api', _express2.default.static(process.cwd() + './js/api'));
app.use('/src', _express2.default.static('src'));

// View engine ejs
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/../src');
app.set('view engine', 'html');
// Routes
(0, _index2.default)(app);

// Socket.io
var http = require('http').Server(app);
var io = (0, _socket2.default)(http);

io.on('connection', function (socket) {
  console.log('Sockect connected:', socket.id);
  socket.on('action', function (action) {
    switch (action.type) {
      case 'server/ADD_STOCK_DATA':
        io.sockets.emit('action', { type: 'CLIENT_ADD_STOCK', payload: action.payload });
        break;
      case 'server/REMOVE_STOCK':
        io.sockets.emit('action', { type: 'CLIENT_REMOVE_STOCK', payload: action.payload });
        break;
    }
  });
});

// https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md
app.use(handleRender);
function handleRender(req, res) {
  _stocks2.default.find(function (err, stocks) {
    if (err) console.log(err);
    var today = new Date();
    var mm = today.getMonth() - 2;
    var dd = today.getDate();
    var startDate = today.getFullYear() - 1 + (mm > 9 ? '-' : '-0') + (mm < 1 ? mm + 12 : mm) + (dd > 9 ? '-' : '-0') + dd;

    // Take requests and call them all together.
    var promises = [];
    stocks.map(function (e, i) {
      promises.push((0, _axios2.default)({
        url: process.env.API_URL_SEARCH + 'WIKI/' + e.stock.id + '.json',
        params: {
          api_key: process.env.API_KEY,
          column_index: 4,
          collapse: 'weekly',
          start_date: startDate,
          order: 'asc'
        }
      }));
    });
    _axios2.default.all(promises).then(function (result) {
      var newStocks = [];
      result.forEach(function (e, i) {
        newStocks.push({
          stock: {
            id: stocks[i].stock.id,
            description: stocks[i].stock.description,
            data: e.data.dataset.data
          }
        });
      });

      renderAfterApis(newStocks, res);
    }).catch(function (err) {
      console.log('Failed to fetch all data', err);
      renderAfterApis(stocks, res);
    });
  });
}

function renderAfterApis(stocks, res) {
  // Make store with initial state
  var initialState = {
    stock: {
      isFetching: false,
      isFetchFail: false,
      stocks: stocks || null,
      search: ''
    }
  };
  var store = (0, _store2.default)(initialState);
  // render html first before adding JS for faster load speed
  var html = (0, _server.renderToString)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(_App2.default, null)
  ));
  var preloadedState = store.getState();
  res.send(renderFullPage(html, preloadedState));
}

function renderFullPage(html, preloadedState) {
  return '\n    <html>\n      <head>\n        <title>Stock Market</title>\n        <script src="https://use.fontawesome.com/663123f680.js"></script>\n        <script src="/socket.io/socket.io.js"></script>\n        <link href="/src/index.css" rel="stylesheet" type="text/css">\n      </head>\n      <body>\n        <div id="root">' + html + '</div>\n        <script>\n          // WARNING: See the following for security issues around embedding JSON in HTML:\n          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations\n          window.__PRELOADED_STATE__ = ' + JSON.stringify(preloadedState).replace(/</g, '\\u003c') + '\n        </script>\n        <script src="/src/bundle.min.js"></script>\n      </body>\n    </html>\n  ';
}

var port = process.env.PORT || 8080;
http.listen(port, function () {
  console.log('Node.js listening on port ' + port + '...');
});