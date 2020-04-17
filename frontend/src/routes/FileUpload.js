import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class FileUpload extends Component {

	state = {
		selectedFile: null,
	}

	handleFileInput(e){
		this.setState({
			selectedFile : e.target.files[0],
		})
	}

	handlePost = () => {

		let formData = new FormData();
		//console.log(this.state.selectedFile)
		if(this.state.selectedFile === null){
			alert('file select required')
			return
		}
		formData.append('file', this.state.selectedFile);

		axios.post("/api/upload/", formData).then(res => {
			alert('sucess')
			return this.props.history.push('/MaterialSelect');
		}).catch(err => {
			alert('file upload fail')
			console.log(err)
		})

	}

	render() {
		return (
			<div>
				<Link to="/">
					<button>
						PREVIOUS
					</button>
				</Link>
				<div>
					<input type="file" name="file" onChange=
					{e => this.handleFileInput(e)}/>
					<button type="button" onClick={this.handlePost}>upload </button>
				</div>
				<div>
					FileUpload
				</div>
		
			</div>
		);
	}
}

export default FileUpload;
