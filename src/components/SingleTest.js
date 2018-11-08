// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi, Ben Martinson

import React, { Component } from 'react'
import Tester from './Tester';
import DataVis from './DataVis';
import {addRecord} from '../helpers/api'



// top part of the single test, where user selects time and diffuculity
class ChooseTimeAndDiff extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      timeChoice: 10,
      diffChoice: "easy"
    }
    this.onChange = this.onChange.bind(this)
    this.onApply = this.onApply.bind(this)
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onApply(e){
    // when take test is clicked, then send the data to parent component
    this.props.handleApply(this.state.timeChoice, this.state.diffChoice)
  }


  render(){
  return(
  <div className="card">
    <div className="card-body form-inline">
      <label>Choose time for the test: </label>
      <select className="custom-select timeChoicePick ml-2" value={this.state.timeChoice} name="timeChoice" onChange={this.onChange}>
        <option value="10">10 seconds</option>
        <option value="60">1 minute</option>
        <option value="180">3 minutes</option>
        <option value="300">5 minutes</option>
      </select>
      <label>Choose difficulty: </label>
      <select className="custom-select timeChoicePick ml-2" value={this.state.diffChoice} name="diffChoice" onChange={this.onChange}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button className="btn btn-primary" onClick={this.onApply}>Take Test</button>
    </div>
  </div>
  )}
}

class SingleTest extends Component {

	defaultState = {
	    	speedOverTime: [],
	        accOverTime: [],
	        errorKeys: {},
	        wordErrors: {},
          timeChoice: 0,
          diffu: "easy",
          dataShown: false
    	}

	constructor(props){
		super(props);
    	this.testHandler = this.testHandler.bind(this)
    	this.state = this.defaultState
      this.applyChange = this.applyChange.bind(this)
      this.nextTest = this.nextTest.bind(this)
      this.changeTimeHandler = this.changeTimeHandler.bind(this)
	}

	testHandler(currentSpeed, speedOverTime, accuracyOverTime, errorList, wordErrorList){
      this.setState({
        speedOverTime: speedOverTime,
        accOverTime: accuracyOverTime,
        errorKeys: errorList,
        wordErrors: wordErrorList,
        dataShown: true
      })

      // send data to the server
      // need to find a way to check the user is signed in before send data
      if(this.props.isLoggedIn){
        let dataObj = { speed: currentSpeed, accuracy: 95 }
        addRecord(dataObj)
      }

  }

  applyChange(timeChoice, diffChoice){
    this.setState({
      timeChoice: timeChoice,
      diffu: diffChoice
    })
  }

  nextTest(){
    // rest test
    this.setState({
      dataShown: false,
      timeChoice: 0
    })
  }

  changeTimeHandler(){
    this.setState({timeChoice: 0})
  }

	render(){
    let timeChoiceFilled = this.state.timeChoice === 0? false: true
    let dataShown = this.state.dataShown

    // console.log(this.props.location.state)
		return (<div>{!dataShown && !timeChoiceFilled && <ChooseTimeAndDiff handleApply={this.applyChange} /> }
      <div className="testArea">{!dataShown && timeChoiceFilled 
        && <Tester testHandler={this.testHandler} timeChoice={this.state.timeChoice} training={false} diffu={this.state.diffu} changeTimeHandler={this.changeTimeHandler} />}
      {dataShown && timeChoiceFilled && <DataVis speedOverTime={this.state.speedOverTime} accOverTime={this.state.accOverTime}
        errorKeys={this.state.errorKeys} wordErrors={this.state.wordErrors} />}
      {dataShown && <button onClick={() => this.nextTest()} ype="button" className="btn btn-primary">Retake test</button>}
      </div></div>)
	}

}



export default SingleTest;
