import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

import FileUpload from '../components/FileUpload';
import MaterialSelect from '../components/MaterialSelect';
import update from 'react-addons-update'

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
			name: "hello"
		},
		selectedMaterial: null,
		selected: [true,true],
		materialList: ["--------------------"],
		activeStep: 0,
		steps: ['Select Print File', 'Choose Material', 'Print'],
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
				return 'unknown';
		}
	}
	
	handleNext = () => {
		this.setState({
			activeStep: this.state.activeStep + 1
		})
	}
	handlePrint = () => {
		console.log("hswefjsdf")	
	}
	handleReset = () => {
		this.setState({
			activeStep: 0
		})
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

	handleStartPost = () => {
		axios.post("/api/start/").then(res => {
			alert('sucess')
		}).catch(err => {
			alert('print fail')
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
