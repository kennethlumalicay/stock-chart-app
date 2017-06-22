import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from './../actions/actions.js';

@connect(
	state => ({
		stock: state.stock
	})
)

class List extends Component {
	constructor(props) {
		super(props);
	}

	addStockHandler(e) {
		var taken = false;
		this.props.stock.stocks.forEach(v=> {
			if(e.target.value.toUpperCase() == v.stock.id)
				taken = true;
		});
		if(e.keyCode===13 && !taken) {
			actionCreators.lookUpStock(e.target.value, this.props.stock.stocks, this.props.dispatch);
			e.target.value = '';
		}
	}

	removeStockHandler(e) {
		actionCreators.removeStock(e.currentTarget.getAttribute('data-value'), this.props.dispatch);
	}

	render() {
		return (
	    <section id="list">
	    	<input type="text" id="input" placeholder="Stock symbol here."
	    			className={this.props.stock.isFetchFail?"fail":""}
	    			onKeyUp={this.addStockHandler.bind(this)}
	    			disabled={this.props.stock.isFetching}/>
	    	<div id="symbol-container">
	    	{this.props.stock.stocks?this.props.stock.stocks.map((e,i)=>
	    			<div key={i} data-value={e.stock.id} className='symbols'
	    				onClick={this.removeStockHandler.bind(this)}>
		    			<h3>{e.stock.id}</h3>
		    			<p className='description'>{e.stock.description.split(' ').slice(0,3).join(' ')}</p>
	    			</div>):[]}
	    	</div>
	    </section>
    )
  }
};

export default List;