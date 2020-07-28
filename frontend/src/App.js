import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Progress, Print } from './routes';
import SideBarHeader from './components/SideBarHeader';

class App extends Component {
	
	state = {
		posts:[],
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
						</Switch>
					</SideBarHeader>
				</Router>
			</div>
		);
	}
}

export default App;

