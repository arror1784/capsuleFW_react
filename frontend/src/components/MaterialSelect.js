import React, { Component } from 'react';

class Print extends Component {

	state = {
		material: 'Choose here',
		materialList: ["-------------------------"],
	}

	componentDidMount(){
		if(this.props.material === null){
			return
		}
		this.setState({
			material: this.props.material
		})
	}

	materialChange = (event) => {
		this.setState({	material: event.target.value },() => {

			if(this.state.material === 'Choose here'){
				alert('material select required')
				return	
			}

			this.props.onMaterialSelected(this.state.material)
		});
	}


	render() {
		return (
			<div>
				<select value={this.state.material} onChange={this.materialChange}>
					<option disabled>Choose here</option>
					{this.props.materialList.map((material,index) => {
						return <option key={index}>{material}</option>
					})}
				</select>
			</div>
		);
	}
}

export default Print;
