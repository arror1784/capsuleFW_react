import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class MaterialSelect extends Component {

	state = {
		material: '',
		materialList: [],
	}

	componentDidMount(){
		axios.get('/api/materialList')
		.then(response =>{
			this.setState({
				material: response.data.materialList[0],
				materialList: response.data.materialList
			})
		})
	}

	MaterialChange = (event) => {
		this.setState({
			material: event.target.value
		})
	}

	render() {
		return (
			<div>
                <Link to="/FileUpload">
                    <button>
                        PREVIOUS
                    </button>
                </Link>
				
				<select value={this.state.material} onChange={this.MaterialChange}>
				{this.state.materialList.map((material) => {
					return <option value={material}>{material}</option>
					})}
				</select>
				
				<Link to="/Status">
					<button>
						print
					</button>
				</Link>
				<div>
					{this.state.material}
					MaterialSelect
				</div>
			</div>
		);
	}
}

export default MaterialSelect;
