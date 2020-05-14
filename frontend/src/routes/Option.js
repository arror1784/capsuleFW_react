import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CSRFToken from '../csrftoken';

class FileUpload extends Component {

	state = {
		selectedFile: null,
		fileSelected: false,
		materialSelected: false,
		material: "Choose here",
		materialList: ["--------------------"],
	}

	componentDidMount(){
		axios.get('/api/get_csrf/')
	}

	materialChange = (event) => {
		this.setState({
			material: event.target.value	
		})
	}

	handleFileInput(e){
		this.setState({
			selectedFile : e.target.files[0],
		})
	}

	handleFilePost = () => {
		let formData = new FormData();
		if(this.state.selectedFile === null){
			alert('file select required')
			return
		}
		formData.append('file', this.state.selectedFile);
		axios.post("/api/file/upload/", formData).then(res => {
			this.setState({
				fileSelected: true,
				materialSelected: false
			})
			axios.get('/api/material/')
			.then(response => {
				
				var list=[]
				response.data.forEach((item,index,array) => {
					list.push(item["M_id"])
				})
				if(list.includes('custom_resin')){
					this.setState({
						material: 'custom_resin'
					})
				}else{
					this.setState({
						material: 'Choose here'
					})
				}
				this.setState({
					materialList: list,
				})
			})
			alert('sucess')
		}).catch(err => {
			alert('file upload fail')
		})
	}

	handleMaterialPost = () => {
		var str = "/api/material/" + this.state.material + "/select/" 
		if(this.state.material === 'Choose here'){
			alert('file select required')
			return	
		}
		axios.post(str).then(res => {
			alert('sucess')
			this.setState({
				materialSelected: true
			})
		}).catch(err => {
			alert('material select fail')
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
		return (
			<div>
				<CSRFToken />
				<Link to="/">
					<button>
						PREVIOUS
					</button>
				</Link>
				<div>
					<input type="file" name="file" accept=".zip" onChange=
					{e => this.handleFileInput(e)}/>
					<button type="button" onClick={this.handleFilePost}>
						file select
					</button>
				</div>
				
				{this.state.fileSelected === true && 
				(<div>
					<select value={this.state.material} onChange={this.materialChange}>
						<option disabled>Choose here</option>
						{this.state.materialList.map((material,index) => {
						return <option key={index}>{material}</option>
						})}
					</select>
					<button type="button" onClick={this.handleMaterialPost}>
						material select
					</button>
				</div>)}
				
				{this.state.materialSelected === true &&
				(<div>
					<button type="button" onClick={this.handleStartPost}>
						start
					</button>
				</div>)}
			</div>
		);
	}
}

export default FileUpload;
