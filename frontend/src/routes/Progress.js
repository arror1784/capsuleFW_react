import React, { Component } from 'react';
//import axios from 'axios';

const URL = '/ws/progress'

class Status extends Component {

	state = {
		material: '',
		time: '',
		progress: '0',
	}
	
	componentDidMount(){
		this.ws = new WebSocket('ws://' + window.location.host + URL)
		
		this.ws.onopen = () => {
			console.log('connected')	
		}
		this.ws.onmessage = evt => {
			const message = JSON.parse(evt.data)
			this.setState({
				time: message.time,
				progress: message.progress
			})
		}
		this.ws.onclose = () => {
			console.log("disconnected")
		}
	}
	
	render() {
		return (
			<div>
				time : {this.state.time}<br/>
				progress : {this.state.progress}%
			</div>
		);
	}
}

export default Status;
