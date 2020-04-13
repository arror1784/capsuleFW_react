import React, { Component } from 'react';
//import MyName from './MyName';
//import Counter from './Counter';
//import FileUpload from './FileUpload';
import axios from 'axios';

class App extends Component {
	state = {
		posts:[],
		printerState: 'none',
		material: '',
		fileName: '',
		connecting: 'disconnect',
	}
	
	componentDidMount() {

		axios.get('/api')
		.then(function (response) {
			this.setState({
				posts: response.data
			})
		}.bind(this))
	}
	render() {
	
		return (	
			<div>
				{this.state.posts.map(item => (
					<div key={item.id}>
						<h1>{item.title}</h1>
						<span>{item.content}</span>
					</div>
				))}
			</div>
		);
	}
}

export default App;

