// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi

import React, { Component } from 'react';
import axios from 'axios';
import './Login.css';

class Create extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      username: '',
      password: '',
      message: ''
    };
  }

  // when the text input is changed, update the state
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { name, username, password } = this.state;

    axios.post('/api/auth/register', { name, username, password })
      .then((result) => {
        if(result.data.success){
          this.props.history.push("/login")
        }

        // the username must be taken
        this.setState({ message: 'Username already exists, please choose a different username' });
      }).catch((error) => {
        if(error.response && error.response.status === 401) {
          this.setState({ message: 'Something went wrong with the server' });
        }
      });
  }

  render() {
    const { name, username, password, message } = this.state;
    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.onSubmit}>
          <h2 className="form-signin-heading">Register</h2>
           {message !== '' &&
            <div className="alert alert-warning alert-dismissible" role="alert">
              { message }
            </div>
          }
          <label className="sr-only">Name</label>
          <input type="text" className="form-control" placeholder="Name" name="name" value={name} onChange={this.onChange} required/>
          <label className="sr-only">Username</label>
          <input type="text" className="form-control" placeholder="Username" name="username" value={username} onChange={this.onChange} required/>
          <label className="sr-only">Password</label>
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Create;