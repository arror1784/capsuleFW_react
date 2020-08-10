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
		this.props.onButtonClicked(true)
		let first = e.target.files[0]
		if(first === null){
			alert('file select required')
			this.props.onButtonClicked(false)
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
		let infoB = false;
		let infoR = false;
		for(let i = 0; i < length; ++i)
		{
			let file = e.target.files[i];
			let reader = new FileReader();
			if(file.name === "info.json"){
				infoB = true;
			}else if(file.name === "resin.json"){
				infoR = true;
				this.props.onResinEnable();
			}
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
					if(infoB){
						this.props.onFileUploaded(directoryName, json);
					}else{
						window.confirm("No Project Folder")
						window.location.reload(false);
					}
				}
			}
		}
		this.props.onButtonClicked(false)
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
