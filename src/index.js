import React from 'react'
import ReactDOM from 'react-dom'
import UserProvider, { UserContext, withAuth } from './context/UserContext'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import App from './components/App'


// send the user information with app component
ReactDOM.render(
	<UserProvider>
	<UserContext.Consumer>
		{user => <App user={user} />}
	</UserContext.Consumer>
	</UserProvider>,
	document.querySelector('#root')
)
