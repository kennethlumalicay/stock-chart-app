// https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import createSocketIoMiddleware from 'redux-socket.io';
import App from './../dev/js/components/App.js';
import allReducers from './../dev/js/reducers/index.js';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

// Create Redux store with initial state
const store = createStore(
	allReducers,
	preloadedState,
	applyMiddleware(createSocketIoMiddleware(io(), 'server/'))
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)