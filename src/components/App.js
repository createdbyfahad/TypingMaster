// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi, Ben Martinson

import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import MyProvider, { MyContext } from '../context/dataStore'
import UserProvider, { UserContext, withAuth, PrivateRoute } from '../context/UserContext'
import { withRouter } from 'react-router'
import axios from 'axios';
import { Link } from 'react-router-dom';

import Header from './Header';
import About from './About';
import Tester from './Tester';
import Login from './Login';
import SingleTest from './SingleTest';
import Train from './Train';
import Track from './Track';
import Register from './Register';
import DataVis from "./DataVis";

// greets the user/guest when they enter the app
function Greetings(props){

  if(props.userName){
    return (<div className="alert alert-light black" role="alert">Welcome, <b>{props.userName}</b>, you can practice typing below, or start learning how to type like a master! from Train tab above.</div>)
  }

  return (
    <div className="jumbotron">
      <h1 className="display-4">Welcome!</h1>
      <p className="lead">Master typing like a pro! </p>
      <hr className="my-4" />
      <p>You can start tracking and training after registering (its free)</p>
      <Link to="/register"><button className="btn btn-success btn-lg" type="button" onClick={() => {}}>Register</button></Link>
  </div>)
}


class App extends Component {
  defaultState = {
      isLoggedIn: false
    };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }


  componentDidUpdate(prevProps, prevState) {
    // update the user info
    if(this.state.isLoggedIn != this.props.user.state.isLoggedIn){
      this.setState({isLoggedIn: this.props.user.state.isLoggedIn})
    }
  }

  render() {
  const HeaderWithRouter = withRouter(Header)
  const LoginWithAuth = withAuth(Login)
    return (
      <MyProvider>
      <div>
        <BrowserRouter>
          <div className="container">
            <HeaderWithRouter data={this.state} logoutHandler={this.props.user.logoutHandler} errorMsg={this.props.user.state.errorMsg}/>
            <Route exact path="/" render={(props) => (
              <div>
              <Greetings userName={this.props.user.state.userInfo.name}/>
              <SingleTest {...props} isLoggedIn={this.state.isLoggedIn}/>

              </div>)}
            />
            <Route path="/register" render={(props) => (
              <PrivateRoute component={Register} isLoggedIn={this.state.isLoggedIn} shouldBeLoggedIn={false} redirect="/" {...props} />
              )} />
            <Route path="/login" render={(props) => (
              <PrivateRoute component={LoginWithAuth} isLoggedIn={this.state.isLoggedIn} shouldBeLoggedIn={false} redirect="/" {...props} />
              )} />
            <Route path="/user/train" render={(props) => (
              <PrivateRoute component={withAuth(Train)} isLoggedIn={this.state.isLoggedIn} shouldBeLoggedIn={true} redirect="/" {...props} />
              )} />
            <Route path="/user/data" render={(props) => (
              <PrivateRoute component={Track} isLoggedIn={this.state.isLoggedIn} shouldBeLoggedIn={true} redirect="/" {...props} />
              )} />

            <Route path="/about" component={About} />
          </div>
        </BrowserRouter>
      </div>


      </MyProvider>

    )
  }
}

export default App;
