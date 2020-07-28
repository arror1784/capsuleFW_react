import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
	
	static defaultProps = {
		printStatus : ''
	}
	
	componentDidMount = () => {
		console.log("App.js componentDidMount")
		axios.get('/api/state')
		.then(response => {
			if(response.data.state !== "ready"){
				if(window.location.pathname === "/progress")
					return
				var origin = window.location.origin
				window.location.href = origin + "/progress";
				console.log(origin)
			}
		})
	}
	nextButtonClicked(){
		console.log("NextButtonClicked")
	}

	render() {
		return (
			<div>
				Home
			</div>
		);
	}
}

export default Home;
