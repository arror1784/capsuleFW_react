import React, { Component } from 'react';
import axios from 'axios';
import CSRFToken from '../csrftoken';
import FileUploaderBttn from "./FileUploaderBttn" 

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
		let json = {};
		this.readCount = 0;
		let length = e.target.files.length;
		for(let i = 0; i < length; ++i)
		{
			let file = e.target.files[i];
			let reader = new FileReader();
			reader.readAsDataURL(file); 
			reader.onloadend = () => {

				let base64data = reader.result;     
				json[file.name] = base64data;
				++this.readCount;
				console.log(this.readCount);
				if(this.readCount === length)
				{
					console.log("file~~~");
					//set file name
					this.props.onFileUploaded(directoryName, json);

				}
			}
		}



		
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
