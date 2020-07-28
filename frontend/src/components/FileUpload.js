import React, { Component } from 'react';
import axios from 'axios';
import CSRFToken from '../csrftoken';
import FileUploaderBttn from "./FileUploaderBttn" 
var JSZip = require('jszip');
var FileSaver = require('file-saver');
var  fs = require('fs');

class FileUpload extends Component {

	constructor(props)
	{
		super(props)
	}

	state = {
		selectedFile: null,
	}
	componentDidMount(){
		axios.get('/api/get_csrf/')
	}
	handleFileInput = (e) => {
		let first = e.target.files[0]
		if(first === null){
			alert('file select required')
			return
		}
		//get filename
		let pathString = first.webkitRelativePath.replace(/\\/g,"/");
		let pathTokens = pathString.split( '/' );
		let directoryName = pathTokens[0];
		//zip files...
		var zip = new JSZip();
		for(let i = 0; i < e.target.files.length; ++i)
		{
			let file = e.target.files[i];
			zip.file(file.name, file, {binary: true});
		}

		zip.generateAsync({type:"blob"}).then( (blob) => {
			let formData = new FormData();
			formData.append('file', blob);
			formData.append('folderName', directoryName);
			axios.post("/api/file/upload/", formData).then(res => {
				this.props.onFileUploaded(directoryName);
			}).catch(err => {
				alert('file upload fail')
			})
		});
		
	}

	render() {
		return (
			<div>
				<CSRFToken />
				<FileUploaderBttn handleFile={this.handleFileInput}></FileUploaderBttn>
			</div>
		);
	}
}

export default FileUpload;
