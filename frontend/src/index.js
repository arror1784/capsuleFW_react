import React from 'react';
import ReactDOM from 'react-dom';
//import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//import configureStre from './store/configureStroe';
//import createHistory from 'history/createBrowserHistory';
//import { Router, Route } from 'react-router-dom';

//const store = configureStore();

ReactDOM.render(
//	<Provider store={store}>
//		<Router history={createHistory()}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
//		</Router>
//	</Provider>
	,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
