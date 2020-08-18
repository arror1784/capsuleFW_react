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

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

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
	materialList: [],
	printFiles: null,
	activeStep: 0,
	blocking: false,
	printBTN: "Print",
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
				return <FileUpload onFileUploaded={this.handleFileUpload} onButtonClicked={this.handleFileuploadButtonClicked} onResinEnable={this.handleResinEnable}/>
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
		wsMan.getInstance().ws.addEventListener("message", this.handleWs);
	}
	
	componentWillUnmount(){
		wsMan.getInstance().ws.removeEventListener("message", this.handleWs);
	}

	handleBlockToggle = (enabled) => {
		this.setState({
			blocking: enabled
		})
	}
	handleFileuploadButtonClicked = () => {
		this.handleBlockToggle(true)
	}

	handleWs = (evt) => {
		const message = JSON.parse(evt.data)
		let args = message.arg;
		switch(message.method)
		{
			case "listMaterialName":
				var list = this.state.materialList
				list.push(...args)
				this.setState({
					materialList: list
				})
				if(this.state.activeStep === steps.FILE)
					this.handleNext();
				break;
			case "changeState":
				if(args !== "ready"){
					this.handleBlockToggle(false)
					this.props.history.push('/progress/')
				}
				break;
			case "printSettingError":
				///print setting Error when received print start from UI
				let text = ""
				switch(args){
					case 1:
						text = "LCD OFF : lcd reconnect and reboot."
						break;
					case 2:
						text = "File Error: Project crash."
						break;
					case 3:
						text = "Setting Error: Project crash."
						break;
					case 4:
						text = "Already Printing."
						break;
					case 5:
						text = "USB Connection Error."
						break;
					default:
						break;
				}
				console.log("print setting error code, ", text)
				window.confirm(text)
				this.props.history.push('/progress/')
				// window.location.reload(false);
				break;
			default:
				break;
		}
	}
	handleNext = () => {
		this.setState({	activeStep: this.state.activeStep + 1 })
	}
	handlePrint = () => {
		this.handleBlockToggle(true)
		this.setState({
			printBTN:"Uploading..."
		})
		wsMan.getInstance().sendJson({
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
	handleResinEnable = () => {
		this.setState({
			materialList: ["Custom"]
		})
	}
	handleFileUpload = (filename, fileJson) => {
		this.setState({
			selectedFilename : filename,
			printFiles: fileJson,
			blocking: false,
		})
		console.log(fileJson)
		console.log(filename)
		//query materials
		wsMan.getInstance().sendJson({
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
			<BlockUi tag="div" blocking={this.state.blocking}>
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
										className={classes.button}> {this.state.printBTN} 
									</Button>)}
								</div>
							</StepContent>
						</Step>
					))}
					</Stepper>
				</div>
			</BlockUi>
		);
	}
}

export default withStyles(styles)(Print);
