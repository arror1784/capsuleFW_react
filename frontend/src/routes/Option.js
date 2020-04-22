import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class FileUpload extends Component {

	state = {
		selectedFile: null,
		material: null,
		materialList: ['custom'],
	}

	componentDidMount(){
		axios.get('/api/materialList')
		.then(response => {
			this.setState({
				materialList: response.data.materialList.concat(this.state.materialList),
				material: response.data.materialList[0]
			})
		})
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

	handlePost = () => {

		let formData = new FormData();
		
		if(this.state.selectedFile === null){
			alert('file select required')
			return
		}
		if(this.state.material === null){
			alert('material select required')
			return
		}
		formData.append('file', this.state.selectedFile);

		axios.post("/api/upload/", formData).then(res => {
			alert('sucess')
			return this.props.history.push('/Status');
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
					<button type="button" onClick={this.handlePost}> print </button>
				</div>
				<div>
					<select value={this.state.material} onChange={this.materialChange}>
					{this.state.materialList.map((material) => {
						return <option value={material}>{material}</option>
					})}
					</select>
				</div>
				<div>
					option
				</div>
		
			</div>
		);
	}
}

export default FileUpload;
