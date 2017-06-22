import React, { Component } from 'react';
import Chart from './../containers/Chart.js';
import List from './../containers/List.js';

class App extends Component {
	render() {
		return (
	    <section id="app">
    		<Chart />
            <List />
    		<div id="footer">
    			<p>App made by <a href="https://kennethlumalicay.github.io/portfolio/" target='_blank'>Kenneth Malicay</a></p>
    		</div>
	    </section>
    );
  }
};

export default App;