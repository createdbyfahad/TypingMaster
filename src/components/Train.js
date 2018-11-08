// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi, Ben Martinson

import React, { Component } from 'react'
import Tester from './Tester';
import DataVis from './DataVis';
import {addRecord, updateTrainData, resetTrainingData, getTrainStatus} from '../helpers/api'
import {trainingTimesAndDiffucilties} from '../helpers/other'

// three cases for the train's level info

function SingleTestElementDone(props){
  return (<span className="done_test border border-success col">
    <span className="text-center">Level {props.id + 1}</span><br />Accuracy: {props.accuracy}%<br />Speed (wpm): {props.speed}</span>)
}
function SingleTestElementUndone(props){
  return (<span className="undone_test border border-primary col"><span className="text-center">Level {props.id + 1}</span><br /></span>)
}
function SingleTestElementCurrent(props){
  return (<span className="undone_test border border-primary col font-weight-bold"><span className="text-center">Level {props.id + 1}</span><br />(current)</span>)
}

class CommentResult extends Component {
  constructor(props){
    super(props)
    this.success = true
  }

  getComment(){
    if(this.props.finalAccuracy >= 90){
      return (
        <p>You have passed the test, and are ready to move on to the next level!</p>
      )
    } else {
      this.success = false
      return (
        <p>Your accuracy could improve. Try the test again and shoot for at least 90% correct.</p>
      )
    }
  }

  render(){
    return (
      <div>
        <div>
          The test has finished
        </div>
        <div>
            <p>You had an overall accuracy of {this.props.finalAccuracy}%</p>
            {this.getComment()}
        </div>
        <div className="row">
          {!this.success && <button onClick={() => this.props.retakeTest()} type="button" className="btn btn-primary mr-3">Retake Test</button>}
          {this.success && <button onClick={() => this.props.nextTest()} type="button" className="btn btn-primary mr-3">Next level</button>}
          <p><button onClick={() => this.props.dataShown(true)} type="button" className="btn btn-primary">View Data from test</button></p>
          
        </div>
      </div>
    )
  }
}

class TrackTrainLevel extends Component {

  constructor(props){
    super(props)
  }

  render(){
    var tests = []
    for(var i = 0; i < 10; i++){
      if(i < this.props.currentLevel){
        tests.push(<SingleTestElementDone key={i} id={i} currentLevel={this.props.currentLevel} speed={this.props.trainingData[i].speed} accuracy={this.props.trainingData[i].accuracy}/>)
      }else if(i === this.props.currentLevel){
        tests.push(<SingleTestElementCurrent key={i} id={i} />)

      }else{
        tests.push(<SingleTestElementUndone key={i} id={i} />)
      }

    }

    return [<div className="row">{tests}</div>, <br />]
  }


}

class Train extends Component {

	defaultState = {
  	speedOverTime: [],
    accOverTime: [],
    errorKeys: {},
    wordErrors: {},
    currentLevel: null,
    trainingData: null,
    diffu: "easy",
    testFinished: false,
    finalAccuracy: 0,
    showData: false,
    timeChoice: 0,
    trainingFinished: false
  }

	constructor(props){
		super(props);

    this.testNumber = this.props.testNumber
    this.easyShown = []
    this.medShown = []
    this.hardShown = []

    this.testHandler = this.testHandler.bind(this)
    this.state = this.defaultState
    this.resetTrainData = this.resetTrainData.bind(this)
    this.retakeTest = this.retakeTest.bind(this)
    this.nextTest = this.nextTest.bind(this)
    this.updateDifficulty = this.updateDifficulty.bind(this)
    this.updateShownTexts = this.updateShownTexts.bind(this)
    this.trainingOver = this.trainingOver.bind(this)
	}

  resetTrainData(){
    // make sure the user wants to reset
    if(window.confirm('Are you sure you want to reset training data?')){
      // send request to server to delete all records
      resetTrainingData((state) => this.setState(state))
      this.setState({
        testFinished: false,
        currentLevel: 0,
        diffu: 'easy',
        showData: false
      });
    }

  }

  updateShownTexts(arrayToUpdate, textNumber){
    if(arrayToUpdate === 'easy')
      this.easyShown.push(textNumber)
    else if(arrayToUpdate == 'medium')
      this.medShown.push(textNumber)
    else
      this.hardShown.push(textNumber)

  }


  componentDidMount(){
    // get the training status and put it in state
    getTrainStatus((state) => this.setState(state))

  }

	testHandler(currentSpeed, speedOverTime, accuracyOverTime, errorList, wordErrorList){
      let finalAccuracy = accuracyOverTime[accuracyOverTime.length-1]
      this.setState({
        speedOverTime: speedOverTime,
        accOverTime: accuracyOverTime,
        errorKeys: errorList,
        wordErrors: wordErrorList,
        currentSpeed: currentSpeed,
        finalAccuracy: finalAccuracy
      })

      this.setState({
        testFinished: true
      });

  }

  nextTest(){
      let newCurrentLevel = this.state.currentLevel + 1
      if (newCurrentLevel == 10){
        this.setState({
          trainingFinished: true
        })
      }

      // test is finished. send data to user's records
      let dataObj = { speed: this.state.currentSpeed, accuracy: this.state.finalAccuracy }
      addRecord(dataObj)

      // update user training data to the server
      dataObj = { speed: this.state.currentSpeed, accuracy: this.state.finalAccuracy, currentLevel: newCurrentLevel }
      updateTrainData(dataObj)

      let level = newCurrentLevel
      let newTimeChoice = 0
      if(level < 3) newTimeChoice = 60
      else if(level < 6) newTimeChoice = 180
      else if(level < 9) newTimeChoice = 300
      else newTimeChoice = 420

      // succsuffuly update the user data in server
      // update data locally
      this.updateDifficulty(newCurrentLevel)
      this.setState({
        currentLevel: newCurrentLevel,
        timeChoice: newTimeChoice,
        trainingData: this.state.trainingData.concat([dataObj]),
        testFinished: false,
        showData: false
      });
  }

  retakeTest(){
    let dataObj = { speed: this.state.currentSpeed, accuracy: this.state.finalAccuracy }
    addRecord(dataObj)
    this.setState({
      testFinished: false,
      showData: false
    })
  }

  retakeCurrent(){
    this.setState({ testFinished: false })

  }

  updateDifficulty(level){
    let diff = ''
    if(level % 3 == 0) diff = 'easy'
    else if(level % 3 == 1) diff = 'medium'
    else diff = 'hard'

    this.setState({ diffu: diff})
  }

  trainingOver(){
    this.setState({trainingFinished: true})
    this.resetTrainData()
  }


	render(){
    if(!trainingTimesAndDiffucilties[this.state.currentLevel]){
      return(<div></div>)
      // trainingTimesAndDiffucilties[this.state.currentLevel].time : 10)
    }
    let timeChoice = trainingTimesAndDiffucilties[this.state.currentLevel]?
      trainingTimesAndDiffucilties[this.state.currentLevel].time : 10

		return (<div><h2>Train Your Typing Skills <span className="badge badge-danger h2badge" onClick={this.resetTrainData}>Reset Training (level 0)</span></h2><br />
          {!this.state.trainingFinished && this.state.currentLevel == 0 && !this.state.testFinished &&
        <div><div>Welcome to the Trainer! There are 10 typing tests that alternate between easy, medium and hard text difficulty.
        There are 3 tests for 1 minute, 3 for 3 minutes, 3 for 5 minutes and the last one is 7 minutes. </div><br />
        <div>When your ready to start, begin typing in the text field below.</div><br/> </div>}

      <TrackTrainLevel currentLevel={this.state.currentLevel} trainingData={this.state.trainingData} />

      {!this.state.trainingFinished && !this.state.testFinished && <Tester testHandler={this.testHandler}  training={true} timeChoice={this.state.timeChoice}
        testNumber={this.state.currentLevel} diffu={this.state.diffu} updateTexts={this.updateShownTexts} trainingIsOver={this.trainingOver}/>}

      {!this.state.trainingFinished && this.state.testFinished && <CommentResult finalAccuracy={this.state.finalAccuracy}
        nextTest={this.nextTest} retakeTest={this.retakeTest} dataShown={(update) => this.setState({showData: update})}/>}

        <br />
      {!this.state.trainingFinished && this.state.showData && <DataVis speedOverTime={this.state.speedOverTime} accOverTime={this.state.accOverTime}
        errorKeys={this.state.errorKeys} wordErrors={this.state.wordErrors} />}

      {this.state.trainingFinished && <div> This round of training is complete!
      <br /><br /></div>}

      </div>)

	}

}



export default Train;
