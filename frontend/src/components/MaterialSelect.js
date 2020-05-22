import React, { Component } from 'react';
import axios from 'axios';
import CSRFToken from '../csrftoken';

class Print extends Component {

	state = {
		material: 'Choose here',
		materialList: ["-------------------------"],
	}

	componentDidMount(){
		axios.get('/api/get_csrf/')
		if(this.props.material === null){
			return
		}
		this.setState({
			material: this.props.material
		})
	}

	materialChange = (event) => {
		this.setState({
			material: event.target.value	
		})
	}

	handleMaterialPost = () => {
		var str = "/api/material/" + this.state.material + "/select/" 
		if(this.state.material === 'Choose here'){
			alert('material select required')
			return	
		}
		axios.post(str).then(res => {
			this.props.onMaterialSelected(this.state.material)
		}).catch(err => {
			alert('material select fail')
		})
	}
	render() {
		return (
			<div>
				<CSRFToken />
				<select value={this.state.material} onChange={this.materialChange}>
					<option disabled>Choose here</option>
					{this.props.materialList.map((material,index) => {
						return <option key={index}>{material}</option>
					})}
				</select>
				<button type="button" onClick={this.handleMaterialPost}>
					material select
				</button>
			</div>
		);
	}
}

export default Print;
