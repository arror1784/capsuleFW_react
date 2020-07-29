import React, { Component, useState } from 'react';

import ProgressBar from '../components/ProgressBar'
import axios from 'axios';
import styles from './Progress.module.scss';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';




const URL = ':8000/ws/progress'


class Status extends Component {

	constructor(props) {
		super(props);
	}

	state = {
		material: '',
		fileName: '',
		layerHeight: 0,
		totalDuration: 0,
		intervalID: null,
		startTime: 0,
		progress: 15,
		state: 'ready',
		timeSec: 0,
		timeMin: 0,
	}
	
	componentDidMount(){
		this.ws = new WebSocket('ws://' + window.location.hostname + URL)
		
		this.ws.onopen = () => {
			console.log('connected')	
		}
		this.ws.onmessage = evt => {
			const message = JSON.parse(evt.data)
			if(message.method === "start"){
				this.setState({
					state: "print",
					timeSec: 0,
					timeMin: 0,
					progress: 0
				})
			}else if(message.method === "setTimerOnoff"){
				if(message.onOff === true){
					var intervalId = setInterval(this.tick, 100);
					this.setState({
						intervalID: intervalId
					})
				}else if(message.onOff === false){
					clearInterval(this.state.intervalID);
				}
			}else if(message.method === "setTimerTime"){
				var date = new Date()
				this.setState({
					startTime: date.getTime()
				})
			}else if(message.method === "pause"){
				this.setState({
					state: "pause"
				})
			}else if(message.method === "finish"){
				this.setState({
					state: "ready"
				})
				clearInterval(this.state.intervalID);
			}else if(message.method === "resume"){
				this.setState({
					state: "print"
				})
			}else if(message.method === "update"){
				this.setState({
					progress: message.progress
				})
			}
		}
		this.ws.onclose = () => {
			console.log("disconnected")
		}
		axios.get('/api/state')
        .then(response => {
			this.setState({
				state: response.data.state
			})
        })
	}

	componentWillUnmount(){
		this.ws.close()
	}
	
	tick = () => {
		var date = new Date()
		var currentDuration = date.getTime() - this.state.startTime
		var currentDate = new Date(currentDuration)

		this.setState({
			timeSec: currentDate.getSeconds(),
			timeMin: currentDate.getMinutes()
		})
	}


	render() {

		let buttons;
		let mainStr;

		switch(this.state.state)
		{
			case "pause":
				buttons =
				<div className ="button-container" >
					<Button variant="contained" color="primary">Resume</Button>
					<Button variant="contained" color="secondary">Quit</Button>
				</div>
				mainStr = "Paused... " +this.state.progress + "%" ;

				break;
			case "pause_start":
				buttons =
				<div className ="button-container" >
					<Button variant="contained" disabled>Pausing...</Button>
				</div>	
				mainStr = "Pausing... " +this.state.progress + "%" ;
				break;
			case "print":
				buttons =
				<div className ="button-container">
					<Button variant="contained" color="primary">Pause</Button>
				</div>	
				mainStr = "Printing... " +this.state.progress + "%" ;
				break;
			default:
				mainStr = "Ready";
				
		}



		return (
			<div className="progress-container">
				<h1>{mainStr}</h1>
				<div className="text-container">
					<p>{mainStr}</p>
					<p>{mainStr}</p>

				</div>

					{/* <h5>{mainStr}</h5> */}


				<section>
					<article>
						<ProgressBar value={this.state.progress}/>
					</article>
				</section>
				{buttons}
			</div>
		);
	}
}



export default Status;
