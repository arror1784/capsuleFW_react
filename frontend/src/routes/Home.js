import React, { Component } from 'react';

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
