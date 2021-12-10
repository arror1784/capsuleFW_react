import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Home, Progress, Print } from './routes';
import SideBarHeader from './components/SideBarHeader';
import wsMan from './WsManager'
class App extends Component {
	state = {
		product: ''
	}

	constructor(props)
	{
		super(props);
	}

	componentDidMount(){
		wsMan.getInstance().ws.addEventListener("message", (evt) => {
			const message = JSON.parse(evt.data)
			let args = message.arg
			switch(message.method)
			{
				case "setProductName":
					this.setState({
						product:args
					});
					break;
			}
		});
	}

	render() {
		// if (wsMan.getInstance().ws === undefined || wsMan.getInstance().ws.readyState !== WebSocket.OPEN) {
        //     return <div />;
        // }
		return (	
			<div>
				<Router>
					<SideBarHeader product={this.state.product}>
						<Switch>
							{/* <Route exact path="/" component={Home} /> */}
							<Route exact path="/">
								<Redirect to="/progress" />
							</Route>
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

