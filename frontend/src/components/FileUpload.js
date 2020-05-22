import React, { Component } from 'react';
import axios from 'axios';
import CSRFToken from '../csrftoken';

class FileUpload extends Component {

	state = {
		selectedFile: null,
	}
	componentDidMount(){
		axios.get('/api/get_csrf/')
	}
	handleFileInput(e){
		console.log(e.target.value)
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
			this.props.onFileUploaded(this.state.selectedFile)	
		}).catch(err => {
			alert('file upload fail')
		})
	}
	render() {
		return (
			<div>
				<CSRFToken />
				<input type="file" name="file" accept=".zip" onChange=
				{e => this.handleFileInput(e)}/>
				<button type="button" onClick={this.handleFilePost}>
					file select
				</button>
			</div>
		);
	}
}

export default FileUpload;
