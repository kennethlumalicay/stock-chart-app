import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import allReducers from './js/reducers/index.js';

const Store = (initialState) =>
			createStore(
				allReducers,
				initialState,
				applyMiddleware(thunk)
			);
export default Store;