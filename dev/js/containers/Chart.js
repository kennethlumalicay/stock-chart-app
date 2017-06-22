import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import axios from 'axios';
import ChartJs from 'chart.js';
import * as actionCreators from './../actions/actions.js';

@connect(
	state => ({
		stock: state.stock
	})
)

class Chart extends Component {
	constructor(props) {
		super(props);
		this.drawChart = this.drawChart.bind(this);
		var stockChart;
		var drawn;
	}

	componentDidUpdate() {
		this.drawChart();
	}
	componentDidMount() {
		this.drawChart();
	}

	drawChart() {
		if(this.props.stock.stocks.length) {
			if(this.props.stock.stocks[0].stock.data) {
				var colors = ['rgb(255,0,0)','rgb(255,0,255)','rgb(255,255,0)','rgb(0,255,255)','rgb(155,0,0)',
						'rgb(155,0,155)','rgb(155,155,0)','rgb(0,155,155)','rgb(100,0,0)','rgb(100,0,100)',
						'rgb(100,100,0)','rgb(0,100,100)','rgb(50,0,0)','rgb(50,0,50)','rgb(50,50,0)'];
				var temp = [...this.props.stock.stocks];
				var labels = temp.sort((a,b) => a.stock.data.length + (b?b.stock.data.length:0))[0]
						.stock.data.map(e=>e[0]);
				var datasets = temp.map((e,i)=> ({
					label: e.stock.id,
					borderColor: colors[i],
					borderWidth: 1,
					pointRadius: 0,
					data: e.stock.data.map(e=>e[1])
				}));
				var ctx = this.refs.lineChart;
				this.stockChart = new ChartJs(ctx, {
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

	fetchData() {
		actionCreators.getAllStockData(this.props.stock.stocks, this.props.dispatch);
	}

	render() {
		if(this.stockChart)
			this.stockChart.destroy();
		return (
	    <section id="chart" ref="chart">
	    	<canvas id="lineChart" ref="lineChart"></canvas>
	    	{this.drawn?[]:<button id="fetch-btn" onClick={this.fetchData.bind(this)}
	    		disabled={this.props.stock.isFetching}>Fetch data</button>}
	    </section>
    )
  }
};

export default Chart;