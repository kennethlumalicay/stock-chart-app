import axios from 'axios';



export function data(query, cb) {
	var url = process.env.API_URL_SEARCH + 'WIKI/' +
		query.search + '.json';
	// get startDate yyyy-mm-dd format
  var today = new Date();
  var mm = today.getMonth()-2;
  var dd = today.getDate();
  var startDate = today.getFullYear()-1
      + (mm>9?'-':'-0') + (mm<1?mm+12:mm)
      + (dd>9?'-':'-0') + dd;

	axios({
		url: url,
		params: {
			api_key: process.env.API_KEY,
			column_index: 4,
			collapse: 'weekly',
			start_date: startDate,
			order: 'asc'
		}
	}).then(res => {
		cb(res.data.dataset.data);
	}).catch(err => {
		console.log('Failed to get', query.search ,'from STOCK FETCH DATA.');
		cb(null);
	});
}

export function search(query, cb) {
	var url = process.env.API_URL_SEARCH + 'WIKI/' +
		query.search + '/metadata.json';
	axios({
		url: url,
		params: {
			api_key: process.env.API_KEY
		}
	}).then(res => {
		cb(res.data);
	}).catch(err => {
		console.log('Failed to get', query.search ,'from STOCK FETCH SEARCH.');
		cb(null);
	});
}