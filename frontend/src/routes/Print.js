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
				var list = []
				if(this.state.materialList.includes("Custom")){
					list.push("Custom")
				}
				list.push(...args)
				this.setState({
					materialList: list
				})
				if(this.state.activeStep === steps.FILE)
					this.handleNext();
				break;
			case "changeState":
				if(args !== "unlock"){
					this.handleBlockToggle(false)
					this.props.history.push('/progress/')
				}
				break;
			case "printSettingError":
				///print setting Error when received print start from UI
				let text = ""
				switch(args["code"]){
					case 1:
						text = "Error: LCD가 빠졌습니다.\nLCD를 다시 넣고 재부팅해주세요."
						break;
					case 2:
						text = "Error: 파일에 문제가 있습니다."
						break;
					case 3:
						text = "Error: 세팅값에 문제가 있습니다."
						break;
					case 4:
						text = "Error: 이미 프린트 중입니다."
						break;
					case 5:
						text = "Error: USB 케이블이 연결되지 않았습니다."
						break;
					case 6:
						text = "Error: 파일에 문제가 있습니다."
						break;
					case 7:
						text = "출력완료 후 확인이 필요합니다.\n제품에서 close버튼을 눌러주세요."
						break;
					case 8:
						text = "Error: 지원하지 않은 layer height입니다."
						break;
					default:
						text = "Error: 오류가 발생했습니다."
						break;
				}
				console.log("print setting error code, ", args["message"])
				window.confirm(args["message"])
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
