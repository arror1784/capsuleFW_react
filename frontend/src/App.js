import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, FileUpload, MaterialSelect, Status, PrintFinish, Option } from './routes';
import Test from './routes/Test';
//import Header from './components/Header';

class App extends Component {
	
	state = {
		posts:[],
	}

	componentDidMount() {
		axios.get('/api/state')
		.then(response => {
			if(response.data.state !== "ready"){
				return this.props.history.push('/Status')
			}
		})
	}

	render() {
		return (	
			<Router>
				<div>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/Status" component={Status} />
						<Route path="/Option" component={Option} />
						<Route path="/file" component={FileUpload} />
						<Route path="/file/material" component={MaterialSelect} />
						<Route path="/PrintFinish" component={PrintFinish} />
						<Route path="/Test" Component={Test} />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;

