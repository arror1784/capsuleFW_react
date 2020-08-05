import React, { Component, useState } from 'react';
import ProgressBar from '../components/ProgressBar'
import styles from './Progress.module.scss';
import Button from '@material-ui/core/Button';
import wsMan from '../WsManager'


function toStrTime(date)
{
	if(date)
		return `${date.getMinutes()}m ${date.getSeconds()}s`;
	else
		return '0m 0s';
}

class Status extends Component {

	constructor(props) {
		super(props);
	}

	state = {
		material: '',
		fileName: '',
		layerHeight: 0,
		totalTime: 0,
		intervalID: null,
		startTime: 0,
		progress: 0,
		printerState: 'ready',
		elapsedTime: 0,
	}
	
	componentDidMount(){
		wsMan.ws.addEventListener("message", this.handleWs);
		if (wsMan.ws.readyState !== WebSocket.OPEN)
		{
			let afterConnection = () =>{
				wsMan.sendJson({
					method: 'printInfo'
				});
				wsMan.ws.removeEventListener("open",afterConnection);
			};
			wsMan.ws.addEventListener("open",afterConnection);
		}
		else
		{
			wsMan.sendJson({
				method: 'printInfo'
			});
		}


	}

	componentWillUnmount(){
		wsMan.ws.removeEventListener("message", this.handleWs);
	}
	
	tick = () => {
		var date = new Date()
		var currentDuration = date.getTime() - this.state.startTime
		var currentDate = new Date(currentDuration)

		this.setState({
			elapsedTime: currentDate
		})
	}
	handlePause = () => {
		wsMan.sendJson({
			method: 'changeState',
			arg: 'pause'
		});
	}

	handleResume = () => {
		wsMan.sendJson({
			method: 'changeState',
			arg: 'resume'
		});
	}

	handleQuit = () => {
		wsMan.sendJson({
			method: 'changeState',
			arg: 'quit'
		});
	}
	handleEnableTimer = (enabled) => {
		if(enabled){
			//only enable if not already enabled
			if(this.state.intervalID == null)
			{
				var intervalId = setInterval(this.tick, 100);
				this.setState({
					intervalID: intervalId
				})
			}
		}else if(!enabled){
			clearInterval(this.state.intervalID);
			this.setState({
				intervalID: null
			})
		}
	}
	handleWs = (evt) => {
		const message = JSON.parse(evt.data)
		let args = message.arg;
		switch(message.method)
		{
			case "changeState":
				switch(args)
				{
					case "start":
						this.setState({
							printerState: "print",
							totalTime: 0,
							progress: 0
						})
						break;
					case "pause":
						this.setState({
							printerState: "pause"
						})
						break;
					case "finish":
						this.setState({
							printerState: "ready"
						})
						clearInterval(this.state.intervalID);
						break;
					case "resume":
						this.setState({
							printerState: "print"
						})
						break;
					default:
						break;
				}
				break;
			case "printInfo":
				this.setState({
					printerState: args.state,
                    material: args.material,
                    fileName: args.fileName,
                    layerHeight: args.layerHeight,
					elapsedTime: args.elapsedTime,
                    totalTime: args.totalTime,
					progress: args.progress,
				})
				this.handleEnableTimer(args.enableTimer);

				break;
			case "updateProgress":
				this.setState({
					progress: message.progress
				})
				break;
			case "enableTimer":
				this.handleEnableTimer(args);
				break;
			default:
				break;
		}			
	}


	render() {
		let buttons;
		let mainStr;
		switch(this.state.printerState)
		{
			case "pause":
				clearInterval(this.state.intervalID);
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" onClick={this.handleResume}  color="primary">Resume</Button>
					<Button variant="contained" onClick={this.handleQuit} color="secondary">Quit</Button>
				</div>
				mainStr = "Paused... " +this.state.progress + "%" ;

				break;
			case "pause_start":
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" disabled>Pausing...</Button>
				</div>	
				mainStr = "Pausing... " +this.state.progress + "%" ;
				break;
			case "print":
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" onClick={this.handlePause} color="primary">Pause</Button>
				</div>	
				mainStr = "Printing... " +this.state.progress + "%" ;
				break;
			default:
				mainStr = "Ready";
				
		}

		return (
			<div className={styles["progress-container"]}>
				<h1>{mainStr}</h1>
				<div className={styles["text-container"]}>
					<p>Model: {this.state.fileName}</p>
					<p>Material: {this.state.material}</p>
					<p>Layer height: {this.state.layerHeight}mm</p>
					<p>Elapsed time: {toStrTime(this.state.elapsedTime)}</p>
					<p>Total printing time: {toStrTime(this.state.totalTime)}</p>
				</div>
				<ProgressBar value={this.state.progress}/>
				{buttons}
			</div>
		);
	}
}



export default Status;
