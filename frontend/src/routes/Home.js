import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class Home extends Component {
	static defaultProps = {
		printStatus : ''
	}

	nextButtonClicked(){
		console.log("NextButtonClicked")
	}

	render() {
		return (
			<div>
				home
			</div>
		);
	}
}

export default Home;
