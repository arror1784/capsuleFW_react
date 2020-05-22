import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, FileUpload, MaterialSelect, Progress, Print } from './routes';
import Test from './routes/Test';
import SideBarHeader from './components/SideBarHeader';

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
			<div>
				<Router>
					<SideBarHeader>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/progress" component={Progress} />
							<Route path="/print" component={Print} />
							<Route path="/file" component={FileUpload} />
							<Route path="/file/material" component={MaterialSelect} />
							<Route path="/test" Component={Test} />
						</Switch>
					</SideBarHeader>
				</Router>
			</div>
		);
	}
}

export default App;

