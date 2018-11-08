// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi

import React, { Component } from 'react';
import MyProvider, {MyContext} from '../context/dataStore';
import UserProvider, { UserContext } from '../context/UserContext'
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);

    // if the user is signed in, then redirect them to main page
    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    axios.post('/api/auth/login', { username, password })
      .then((result) => {
        // user successfully logged in
        // jwt token is used each time the user requests something from the server
        this.setState({ message: '' });
        // update the app component and redirect to main page
        this.props.user.loginHandler({jwtToken: result.data.token, name: result.data.name})
        this.props.history.push('/')
        
      })
      .catch((error) => {
        if(error.response && error.response.status === 401) {
          this.setState({ message: 'Login failed. Username or password not match' });
        }
      });
  }

  render() {
    const { username, password, message } = this.state;
    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.onSubmit}>
          {message !== '' &&
            <div className="alert alert-warning alert-dismissible" role="alert">
              { message }
            </div>
          }
          <h2 className="form-signin-heading">Please sign in</h2>
          <label className="sr-only">Username</label>
          <input type="text" className="form-control" placeholder="Username" name="username" value={username} onChange={this.onChange} required/>
          <label className="sr-only">Password</label>
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
          <p>
            Not a member? <Link to="/register"><span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Register here</Link>
          </p>
        </form>
      </div>
    );
  }
}

export default Login;