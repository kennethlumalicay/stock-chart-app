import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import socket from 'socket.io';
import axios from 'axios';
var mongoStore = require('connect-mongo')(session);
require('dotenv').load();

// File imports
import App from './js/components/App.js';
import Store from './store.js';
import routes from './js/routes/index.js';
import Stocks from './js/models/stocks.js';

// Init
var app = express();
mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise;

// Session
app.use(session({
  secret: 'secretKLM',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.enable('trust proxy');

// Static
app.use('/actions', express.static(process.cwd() + './js/actions'));
app.use('/components', express.static(process.cwd() + './js/components'));
app.use('/config', express.static(process.cwd() + './js/config'));
app.use('/containers', express.static(process.cwd() + './js/containers'));
app.use('/models', express.static(process.cwd() + './js/models'));
app.use('/reducers', express.static(process.cwd() + './js/reducers'));
app.use('/api', express.static(process.cwd() + './js/api'));
app.use('/src', express.static('src'));

// View engine ejs
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/../src');
app.set('view engine', 'html');
// Routes
routes(app);

// Socket.io
var http = require('http').Server(app);
var io = socket(http);

io.on('connection', function(socket) {
  console.log('Sockect connected:', socket.id);
  socket.on('action', action => {
    switch(action.type) {
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
  Stocks.find(function(err, stocks) {
    if(err) console.log(err);
    var today = new Date();
    var mm = today.getMonth()-2;
    var dd = today.getDate();
    var startDate = today.getFullYear()-1
        + (mm>9?'-':'-0') + (mm<1?mm+12:mm)
        + (dd>9?'-':'-0') + dd;

    // Take requests and call them all together.
    var promises = [];
    stocks.map((e,i) => {
      promises.push(axios({
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
    axios.all(promises)
    .then(result => {
      var newStocks = [];
      result.forEach((e,i) => {
        newStocks.push({
          stock: {
            id: stocks[i].stock.id,
            description: stocks[i].stock.description,
            data: e.data.dataset.data
          }
        });
      });

      renderAfterApis(newStocks, res);
    }).catch(err => {
      console.log('Failed to fetch all data', err);
      renderAfterApis(stocks, res, true);
    });
  });
}

function renderAfterApis(stocks, res, isFetchFail = false) {
  // Make store with initial state
  let initialState = {
    stock: {
      isFetching: false,
      isFetchFail: isFetchFail,
      stocks: stocks || null,
      search: ''
    }
  };
  const store = Store(initialState);
  // render html first before adding JS for faster load speed
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const preloadedState = store.getState();
  res.send(renderFullPage(html, preloadedState));
}

function renderFullPage(html, preloadedState) {
	return `
    <html>
      <head>
        <title>Stock Market</title>
        <script src="https://use.fontawesome.com/663123f680.js"></script>
        <script src="/socket.io/socket.io.js"></script>
        <link href="/src/index.css" rel="stylesheet" type="text/css">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/src/bundle.min.js"></script>
      </body>
    </html>
  `
}

var port = process.env.PORT || 8080;
http.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
