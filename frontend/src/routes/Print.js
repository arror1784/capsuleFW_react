import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

import FileUpload from '../components/FileUpload';
import MaterialSelect from '../components/MaterialSelect';

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

class Print extends Component {

	state = {
		selectedFile: {
			name: ""
		},
		selectedMaterial: null,
		selected: [true,true],
		materialList: ["--------------------"],
		activeStep: 0,
		steps: ['Select Print File', 'Choose Material', 'Print'],
		socketName: "",
	}
	getStepContent(step) {
		switch (step) {
			case 0:
				return <FileUpload onFileUploaded={this.handleFileUpload}/>
			case 1:
				return <MaterialSelect materialList={this.state.materialList} material={this.state.selectedMaterial} onMaterialSelected={this.handleMaterialSelected}/>
			case 2:
				return (<Typography>
						file name :  {this.state.selectedFile.name} <br/>
						material :  {this.state.selectedMaterial}
						</Typography>);
			default:
				return "no more step";
		}
	}
	componentDidMount(){
		this.ws = new WebSocket('ws://' + window.location.hostname + ':8000/ws/setting')

		this.ws.onopen = () => { console.log('connected') }
		this.ws.onclose = (event) => { 
			if(event.code === 4100){
				this.props.history.push('/')
				alert('timeout')
			}
		}
		this.ws.onerror = () => {
			this.props.history.push('/')
			alert('can not access this page')
		}
		this.ws.onmessage = (evt) => {
			const message = JSON.parse(evt.data)
			this.setState({
				socketName: message.name
			})
		}
	}
	componentWillUnmount(){
		this.ws.close()
	}
	handleNext = () => {
		this.setState({	activeStep: this.state.activeStep + 1 })
	}
	handlePrint = () => {
		axios.post("/api/start/").then(res => {
			this.props.history.push('/progress/')
			alert('sucess')
		}).catch(err => {
			alert('print fail')
		})
	}
	handleReset = () => {
		this.setState({	activeStep: 0 })
	}
	handleFileUpload = (file) => {
		this.setState({
			selectedFile: file,
			selected: [false, true]
		})
		axios.get('/api/material/')
		.then(response => {
			var list=[]
			response.data.forEach((item,index,array)=> {
				list.push(item["M_id"])
			})
			if(list.includes('custom_resin')){
				this.setState({
					isCustomResin: true
				})
			}else{
				this.setState({
					isCustomResin: false
				})
			}
			this.setState({
				materialList: list,
			})
		})
	}
	handleMaterialSelected = (material) => {
		this.setState({
			selectedMaterial: material,
			selected: [true, false]
		})
	}
	render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<Stepper activeStep={this.state.activeStep} orientation="vertical">
				{this.state.steps.map((label, index) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
						<StepContent>
							{this.getStepContent(index)}
							<div className={classes.actionsContainer}>
								{this.state.activeStep !== this.state.steps.length - 1
								&&	(<Button
									variant="contained"
									color="primary"
									onClick={this.handleNext}
									disabled={this.state.selected[index]}
									className={classes.button}>
									Next </Button>)} 
								{this.state.activeStep === this.state.steps.length - 1
								&& (<Button
									onClick={this.handleReset}
									className={classes.button}> Reset 
								</Button>)}
								{this.state.activeStep === this.state.steps.length - 1
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
