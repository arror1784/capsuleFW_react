import React, { Component } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Progress.css';

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const URL = ':8000/ws/progress'


class Status extends Component {

	constructor(props) {
		super(props);
	}

	state = {
		material: '',
		intervalID: null,
		startTime: 0,

		state: 'ready',
		timeSec: 0,
		timeMin: 0,
		progress: 100,
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
				satet: response.data.state
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

		return (
			<Grid container  direction="row" spacing={5}>
				<Grid item xs={3} >
					<Paper>
						<Box height={200}  display="flex" alignItems="center" justifyContent="center" textAlign="left" fontSize="h5.fontSize">
							<div >
								state : {this.state.state}<br/>
								time : {this.state.timeMin}min {this.state.timeSec}sec<br/>
								progress : {this.state.progress}%
							</div> 
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={3} >
					<Paper>
						<Box  height={200} display="flex"  justifyContent="center" alignItems="center">
							<CircularProgress  variant="static" size="30%" value={this.state.progress} />
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Button
						variant="contained"
						color="primary"
						onClick={this.handlePrint}
						> PAUSE 
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={this.handlePrint}
						> PAUSE 
					</Button>
				</Grid>
			</Grid>
		
		
		);
	}
}


							

export default Status;
