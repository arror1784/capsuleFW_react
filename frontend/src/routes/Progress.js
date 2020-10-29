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
		intervalBlock: true,
		progress: 0,
		printerState: 'ready',
		startTime: 0,
		elapsedTime: 0,
		time: 0
	}
	
	componentDidMount(){
		wsMan.getInstance().ws.addEventListener("message", this.handleWs);
		if (wsMan.getInstance().ws.readyState !== WebSocket.OPEN)
		{
			let afterConnection = () =>{
				wsMan.getInstance().sendJson({
					method: 'printInfo'
				});
				wsMan.getInstance().ws.removeEventListener("open",afterConnection);
			};
			wsMan.getInstance().ws.addEventListener("open",afterConnection);
		}
		else
		{
			wsMan.getInstance().sendJson({
				method: 'printInfo'
			});
		}
		var date = new Date()
		this.setState({
			startTime: date.getTime
		})
		var intervalId = setInterval(this.tick, 50);
		this.setState({
			intervalID: intervalId
		})
	}

	componentWillUnmount(){
		wsMan.getInstance().ws.removeEventListener("message", this.handleWs);
		clearInterval(this.state.intervalID);
	}
	
	tick = () => {
		if(this.state.intervalBlock)
			return
		var date = new Date();
		var currentDuration = date.getTime() - this.state.startTime + this.state.elapsedTime
		var currentDate = new Date(currentDuration)

		this.setState({
			time: currentDuration
		})
	}
	handlePause = () => {
		wsMan.getInstance().sendJson({
			method: 'changeState',
			arg: 'pause'
		});
	}

	handleResume = () => {
		wsMan.getInstance().sendJson({
			method: 'changeState',
			arg: 'resume'
		});
	}

	handleQuit = () => {
		wsMan.getInstance().sendJson({
			method: 'changeState',
			arg: 'quit'
		});
	}
	handleEnableTimer = (enabled) => {
		if(enabled){
			//only enable if not already enabled
			var date = new Date()
			this.setState({
				startTime: date.getTime()
			})
			this.setState({
				intervalBlock: false
			})
		}else{
			this.setState({
				intervalBlock: true,
				elapsedTime: this.state.time
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
					case "print":
						this.setState({
							printerState: "print",
							totalTime: 0,
							progress: 0,
							time: 0
						})
						break;
					case "pauseStart":
						this.setState({
							printerState: "pauseStart"
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
						break;
					case "resume":
						this.setState({
							printerState: "print"
						})
						break;
					case "quit":
						this.setState({
							printerState: "quit"
						})
						break;
					case "error":		//error signal while printing and still not finish
						this.setState({
							printerState: "error"
						})
						break;
					case "printError":	//error signal when print finish
						this.setState({
							printerState: "ready"
						})
						window.confirm("ERROR while printing")
						break;
					default:
						break;
				}
				break;
			case "printInfo":
				var D = new Date()
				this.setState({
					printerState: args.state,
                    material: args.material,
                    fileName: args.fileName,
                    layerHeight: args.layerHeight,
					elapsedTime: args.elapsedTime,
                    totalTime: args.totalTime,
					progress: args.progress,
					startTime : D.getTime
				})
				this.handleEnableTimer(args.enableTimer);

				break;
			case "updateProgress":
				this.setState({
					progress: args
				})
				break;
			case "enableTimer":
				this.handleEnableTimer(args);
				break;
			case "setTotalTime":
				this.setState({
					totalTime: args
				})
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
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" onClick={this.handleResume}  color="primary">Resume</Button>
					<Button variant="contained" onClick={this.handleQuit} color="secondary">Quit</Button>
				</div>
				mainStr = "Paused... " +this.state.progress + "%" ;

				break;
			case "pauseStart":
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
			case "quit":
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" disabled>Quit...</Button>
				</div>	
				mainStr = "Quit... " +this.state.progress + "%" ;
				break;
			case "error":
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" disabled>Error...</Button>
				</div>	
				mainStr = "Error... " +this.state.progress + "%" ;
				break;
			default:
				mainStr = "Ready";
				
		}
		var Dtotal = new Date(this.state.totalTime)
		var diffDuration = this.state.totalTime - this.state.time
		if(diffDuration < 0)
			diffDuration = -diffDuration
		
		var RTime = new Date(diffDuration)
		return (
			<div className={styles["progress-container"]}>
				<h1>{mainStr}</h1>
				<div className={styles["text-container"]}>
					<p>Model: {this.state.fileName}</p>
					<p>Material: {this.state.material}</p>
					<p>Layer height: {this.state.layerHeight}mm</p>
					<p>Remaining Time: {Dtotal.getTime() === 0 ? "Calculating" : toStrTime(RTime)}</p>
					<p>Total printing time: {Dtotal.getTime() === 0 ? "Calculating" : toStrTime(Dtotal)}</p>
				</div>
				<ProgressBar value={this.state.progress}/>
				{buttons}
			</div>
		);
	}
}



export default Status;
