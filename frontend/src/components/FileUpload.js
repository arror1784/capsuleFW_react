import React, { Component } from 'react';
import FileUploaderBttn from "./FileUploaderBttn" 
import JSZip from 'jszip';

class FileUpload extends Component {

	constructor(props)
	{
		super(props)
	}

	state = {
		selectedFile: null,
	}
	handleFileInput = (e) => {
		this.props.onButtonClicked()
		let first = e.target.files[0]
		if(first === null){
			window.confirm("File select required")
			window.location.reload(false);
			return
		}
		//zip files...
		let json = {};

		let infoB = false

		let file = first;
		let fileName = first.name
		let res = null

		let reader = new FileReader();
		
		if(file.name.endsWith(".zip")){
			
		}else{
			return;
		}
		reader.readAsDataURL(file);
		reader.onloadend = (evt) => {

			res = evt.target.result

			json[fileName] = res
			console.log(res)
			console.log(fileName)

			JSZip.loadAsync(res.split(',')[1],{base64: true}).then( (zip) => {
					let zipInst = zip
					zipInst.forEach(element => {
						if(element === "info.json"){
							infoB = true
						}else if(element === "resin.json"){
							this.props.onResinEnable();
						}
					});
					if(infoB){
						this.props.onFileUploaded(fileName, json);
					}else{
						window.confirm("No Project Folder")
						window.location.reload(false);
					}
				}
			).catch((error) => {
				window.confirm("Zip load error" + error)
				window.location.reload(false);
			})
		}
		reader.onerror = () => {
			window.confirm("File load error")
			window.location.reload(false);
		}
	}

	render() {
		
		return (
			<div>
				<FileUploaderBttn handleFile={this.handleFileInput}></FileUploaderBttn>
			</div>
		);
	}
}

export default FileUpload;
