import axios from 'axios';

export function getAllStockData(stocks, dispatch) {
	dispatch({ type: 'FETCHING_DATA' });
	var promises = [];
	stocks.forEach((e,i) => {
		promises.push(axios({
			url: '/api/stockFetch/data',
			params: {
				search: e.stock.id
			}
		}));
	});
	axios.all(promises)
	.then(res => {
		res.data.forEach((e,i) => {
			stocks[i].stock.data = e.data;
		});
		dispatch({ type: 'server/ADD_STOCK_DATA', payload: stocks });
	})
	.catch(err => {
		console.log('Failed to fetch all data. It is possible that the',
			'request limit has been achieved. Please try again later.');
		console.log(err);
		dispatch({ type: 'FETCH_FAIL' });
	});
}

export function getStockData(search, desc, stocks=[], added, dispatch) {
	axios({
		url : '/api/stockFetch/data',
		params: {
			search: search
		}
	})
	.then(res => {
		var temp = {
				stock: {
					id: search.toUpperCase(),
					description: desc,
					data: res.data
				}
			}
		if(added)
			stocks.push(temp);
		else
			stocks[stocks.length-1] = temp;
		dispatch({ type: 'FETCH_DONE' });
		dispatch({ type: 'server/ADD_STOCK_DATA', payload: stocks });
	})
	.catch(err => {
		dispatch({ type: 'FETCH_FAIL' });
		console.log(err);
	});
}

export function addStock(id, description, prev, dispatch) {
	axios({
		url: '/api/stocks',
		params: {
			id: id,
			desc: description,
			action: 'add'
		}
	})
	.then(res => {
		dispatch({ type: 'ADDED_TO_DB' });
		getStockData(id, description, prev, res.data.length != prev.length, dispatch);
		//getAllStockData(res.data, dispatch);
	})
	.catch(err => {
		console.log(err);
		dispatch({ type: 'FETCH_FAIL' });
		dispatch({ type:'ADD_STOCK_FAIL' });
	});
}

export function lookUpStock(search, stocks, dispatch) {
	dispatch({ type: 'FETCHING_DATA' });
	axios({
		url: '/api/stockFetch/search',
		params: {
			search: search
		}
	})
	.then(res => {
		var id = res.data.dataset.dataset_code;
		var description = res.data.dataset.name;
		addStock(id, description, stocks, dispatch);
	})
	.catch(err => {
		dispatch({ type: 'FETCH_FAIL' });
		dispatch({ type:'LOOKUP_FAIL' });
	});
}

export function removeStock(id, dispatch) {
	axios({
		url: '/api/stocks',
		params: {
			id: id,
			action: 'remove'
		}
	})
	.then(res => {
		dispatch({ type:'server/REMOVE_STOCK', payload: id })
	})
	.catch(err => {
		console.log(err);
		dispatch({ type:'REMOVE_STOCK_FAIL' });
	});
}
