import {combineReducers} from 'redux';
import StockReducer from './reducer-stocks';


const allReducers = combineReducers({
    stock: StockReducer
});

export default allReducers;