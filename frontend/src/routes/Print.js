import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FileUpload from '../components/FileUpload';
import MaterialSelect from '../components/MaterialSelect';
import wsMan from '../WsManager'

const styles = (theme) => ({
	root: {
		width: '100%',
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
});

const  stepsMsg = ['Select Print File', 'Choose Material', 'Print'];
const initState ={
	selectedFilename: "",
	selectedMaterial: null,
	materialList: ["--------------------"],
	printFiles: null,
	activeStep: 0,
}

const steps ={
	FILE: 0,
	MATR: 1,
	PRNT: 2
}

class Print extends Component {

	state = initState;
	getStepContent(step) {
		switch (step) {
			case 0:
				return <FileUpload onFileUploaded={this.handleFileUpload}/>
			case 1:
				return <MaterialSelect materialList={this.state.materialList} material={this.state.selectedMaterial} onMaterialSelected={this.handleMaterialSelected}/>
			case 2:
				return (<Typography>
						file name :  {this.state.selectedFilename} <br/>
						material :  {this.state.selectedMaterial}
						</Typography>);
			default:
				return "no more step";
		}
	}



	componentDidMount(){
		wsMan.ws.addEventListener("message", this.handleWs);
	}
	
	componentWillUnmount(){
		wsMan.ws.removeEventListener("message", this.handleWs);
	}

	handleWs = (evt) => {
		const message = JSON.parse(evt.data)
		let args = message.arg;
		switch(message.method)
		{
			case "listMaterialName":
				this.setState({
					materialList: args
				})
				if(this.activeStep === steps.FILE)
					this.handleNext();
				break;
			case "stateChange":
				if(args.currentState === "print")
					this.props.history.push('/progress/')
				break;
			default:
				break;
		}
	}
	handleNext = () => {
		this.setState({	activeStep: this.state.activeStep + 1 })
	}
	handlePrint = () => {
		wsMan.sendJson({
			method: 'print',
			arg: {
				selectedMaterial: this.state.selectedMaterial,
				selectedFilename: this.state.selectedFilename,
				printFiles: this.state.printFiles,
			}
		});
	}
	handleReset = () => {
		this.setState(initState)
	}
	handleFileUpload = (filename, fileJson) => {
		this.setState({
			selectedFilename : filename,
			printFiles: fileJson,
		})
		//query materials
		wsMan.sendJson({
			method: 'listMaterialName'
		});
	}
	handleMaterialSelected = (material) => {
		this.setState({
			selectedMaterial: material,
		})
		this.handleNext();
	}
	render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<Stepper activeStep={this.state.activeStep} orientation="vertical">
				{stepsMsg.map((label, index) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
						<StepContent>
							{this.getStepContent(index)}
							<div className={classes.actionsContainer}>
								{this.state.activeStep === stepsMsg.length - 1
								&& (<Button
									onClick={this.handleReset}
									className={classes.button}> Reset 
								</Button>)}
								{this.state.activeStep === stepsMsg.length - 1
								&& (<Button
									variant="contained"
									color="primary"
									onClick={this.handlePrint}
									className={classes.button}> Print 
								</Button>)}
							</div>
						</StepContent>
					</Step>
				))}
				</Stepper>
			</div>
		);
	}
}

export default withStyles(styles)(Print);
