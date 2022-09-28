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
function toStrTimeM(date)
{
	if(date)
		return `${-date.getMinutes()}m ${-date.getSeconds()}s`;
	else
		return '0m 0s';
}
const Stopwatch = require("ts-stopwatch").Stopwatch;

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
		progress: 0,
		printerState: 'stop',
		elapsedTime: 0,
		currentTime: 0,
		sw: new Stopwatch(),
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
		var intervalId = setInterval(this.tick, 100);
		this.setState({
			intervalID: intervalId
		})
	}

	componentWillUnmount(){
		wsMan.getInstance().ws.removeEventListener("message", this.handleWs);
		clearInterval(this.state.intervalID);
	}
	
	tick = () => {
		// console.log(this.state.sw.getTime() + this.state.elapsedTime)
		this.setState({
			currentTime: this.state.sw.getTime() + this.state.elapsedTime
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
	handleWs = (evt) => {
		const message = JSON.parse(evt.data)
		let args = message.arg;
		switch(message.method)
		{
			case "changeState":
				this.handleState(args)
				break;
			case "printInfo":
				this.setState({
					printerState: args[0],
                    material: args[1],
                    fileName: args[2],
                    layerHeight: args[3],
					elapsedTime: args[4],
                    totalTime: args[5],
					progress: Number((args[6]*100).toFixed()),
				})
				this.handleState({"state":args[0],"message":""})
				break;
			case "updateProgress":
				this.setState({
					progress: Number((args*100).toFixed())
				})
				break;
			case "setTotalTime":
				this.setState({
					totalTime: args
				})
				break;
			case "start":

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
				break;
			default:
				break;
		}			
	}
	handleState = (args) => {
		switch(args["state"])
		{
			case "working":
				this.state.sw.start()

				this.setState({
					printerState: "working",
				})
				break;
			case "pauseWork":
				this.setState({
					printerState: "pauseWork"
				})
				break;
			case "pause":
				this.state.sw.stop()
				this.setState({
					printerState: "pause"
				})
				break;
			case "stop":
				this.setState({
					printerState: "stop"
				})
				break;
			case "stopWork":
				this.setState({
					printerState: "lock"
				})
				break;
			case "error":		//error signal while printing and still not finish
				this.setState({
					printerState: "error"
				})
				window.confirm(args["message"])
				break;
			case "lock":
				this.setState({
					printerState: "lock"
				})
				this.state.sw.reset()
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
			case "pauseWork":
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" disabled>Pausing...</Button>
				</div>	
				mainStr = "Pausing... " +this.state.progress + "%" ;
				break;
			case "working":
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" onClick={this.handlePause} color="primary">Pause</Button>
				</div>	
				mainStr = "Printing... " +this.state.progress + "%" ;
				break;
			case "stopWork":
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
			case "lock":
				buttons =
				<div className={styles["button-container"]} >
					<Button variant="contained" disabled>Finished...</Button>
				</div>
				mainStr = "Finished... " +this.state.progress + "%" ;
				break;
			default:
				mainStr = "Ready";
				
		}	
		var Dtotal = new Date(this.state.totalTime)	    
		let timeC = this.state.totalTime === 0 ? 0 : this.state.totalTime - this.state.currentTime
		let time = timeC < 0 ? new Date(-timeC) : new Date(timeC)
	
		var Rtext= ""
		if(time < 0){
			var RTime = new Date(-time)
			Rtext = toStrTimeM(RTime)
		}else{
			var RTime = new Date(time)
			Rtext = toStrTime(RTime)
		}

		return (
			<div className={styles["progress-container"]}>
				<h1>{mainStr}</h1>
				<div className={styles["text-container"]}>
					<p>Model: {this.state.fileName}</p>
					<p>Material: {this.state.material}</p>
					<p>Layer height: {this.state.layerHeight}mm</p>
					<p>Remaining Time: {time.getTime() === 0 ? "Calculating" : Rtext}</p>
					<p>Total printing time: {Dtotal.getTime() === 0 ? "Calculating" : toStrTime(Dtotal)}</p>
				</div>
				<ProgressBar value={this.state.progress}/>
				{buttons}
			</div>
		);
	}
}



export default Status;
