import React, { Component } from 'react';
import axios from 'axios';

class FileUpload extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectedFile: null,
		}
	}

	handleFileInput(e){
		this.setState({
			selectedFile : e.target.files[0],
		})
	}

	handlePost(){

		const formData = new FormData();
		formData.append('file', this.state.selectedFile);

		return axios.post("http://localhost:8000/api/upload", formData).then(res => {
			alert('sucess')
		}).catch(err => {
			alert('fail')
		})
	}

	render() {
		return (
			<div>
				<input type="file" name="file" onChange={e => this.handleFileInput(e)}/>
				<button type="button" onClick={this.handlePost()}/>
			</div>
		);
	}
}

export default FileUpload;
