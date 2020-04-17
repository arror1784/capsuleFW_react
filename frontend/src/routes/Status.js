import React, { Component } from 'react';
import axios from 'axios';

class Status extends Component {

	state = {
		material: '',
		time: '',
		progress: '0',
	}
	
	update = () => {
		return axios.get('/api/progress')
				.then(response => {
					if(response.data.hasOwnProperty('finish')){
						console.log("finish")
						this.props.history.push('/PrintFinish')
					}
					this.setState({
						time: response.data.time,
						progress: response.data.progress
					})
				})
	}

	componentDidMount(){
		this.timeID = setInterval(this.update,1000)
	}
	componentWillUnmount(){
		clearInterval(this.timeID)
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
