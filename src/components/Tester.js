// Typing Master
// Last Edit: June 6th, 2018
// Authors: Ben Martinson

import React, { Component } from "react";
import { MyContext } from "../context/dataStore";
import Timer from "./Timer";
import {textSamples} from "../helpers/other";

import "../style.css";

class Tester extends Component {
  constructor(props) {
    super(props);

    this.errorList = {};
    this.speedOverTime = [];
    this.accOverTime = [];
    this.wordErrorList = {};
    this.errorLocations = [];
    this.wordIndex = 0;

    var sampleTextArray = textSamples[this.props.diffu];
    var choosenText = Math.floor(Math.random() * sampleTextArray.length)
    const sample = sampleTextArray[choosenText];
    let trainingCheck = this.props.training
    if(trainingCheck === true){
      this.props.updateTexts(this.props.diffu, choosenText)
    }
    this.sampleArray = sample.split(" ");

    this.spaceErrors = Array.apply(null, Array(this.sampleArray.length)).map(
      Number.prototype.valueOf,
      0
    );
    this.prevKeyWasSpace = true;
    this.prevKeyWasSpace2 = false;
    this.prevKeyDelete = false;

    var wordC = [];
    wordC[0] = 0;
    for (var i = 1; i < this.sampleArray.length; ++i) {
      wordC[i] = wordC[i - 1] + this.sampleArray[i - 1].length;
    }

    var wordArray = Array.apply(null, Array(this.sampleArray.length)).map(
      Number.prototype.valueOf,
      0
    );

    this.wordIC = wordArray;
    this.wordCount = wordC;

    this.state = {
      input: "",
      testStart: false,
      currentSpeed: 60,
      errorCount: 0,
      testOver: false,
      timeChoice: this.props.timeChoice,
      testNumber: this.props.testNumber,
      training: trainingCheck

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleErrorKey = this.handleErrorKey.bind(this);
    this.handleSpaceKey = this.handleSpaceKey.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.testIsOver = this.testIsOver.bind(this);
  }

  componentDidMount() {
    let testNum = this.props.testNumber + 1;
    if(!testNum) testNum = 1

    this.setState({
      currentSpeed: 60,
      testNumber: testNum,
    });
  }

  handleChange(event) {
    if(this.wordIndex+1 === this.sampleArray.length &&
      this.wordIC[this.wordIndex] >= this.sampleArray[this.sampleArray.length-1].length) {
        this.testIsOver()
      }
    let keyValue = event.target.value.charAt(event.target.value.length - 1)
    if (keyValue !== " " || !this.prevKeyWasSpace2){
      if(keyValue === " ") this.prevKeyWasSpace2 = true
      else this.prevKeyWasSpace2 = false

      this.setState({ input: event.target.value, testStart: true });
    }
  }

  handleKeyChange(event) {
    if ((event.key !== " " || !this.prevKeyWasSpace) &&
        (event.key !== " " || this.wordIC[this.wordIndex] !== 0 || !this.prevKeyDelete)) {
      if (event.key === "Backspace") this.handleBackSpace();
      else if (event.key === " ") {
        this.handleSpaceKey();
      } else if (event.key === "Shift") {
        //Do nothing (to avoid incrementing index)
      } else {
        this.handleInputKey(event);
      }
    }

    if(event.key === "Backspace") this.prevKeyDelete = true;
    else this.prevKeyDelete = false;
    if(event.key === " ") this.prevKeyWasSpace = true;
    else this.prevKeyWasSpace = false;
  }

  handleSpaceKey() {
    let lenCurrentWord = this.sampleArray[this.wordIndex].length;
    if (this.wordIC[this.wordIndex] < lenCurrentWord) {
      let numOfErrors = lenCurrentWord - this.wordIC[this.wordIndex];
      this.setState({
        errorCount: this.state.errorCount + numOfErrors
      });
      this.spaceErrors[this.wordIndex] = numOfErrors;
      this.addToWordErrorList(this.sampleArray[this.wordIndex]);
    }
    if (this.wordIndex + 1 < this.sampleArray.length && !this.prevKeyWasSpace) {
      this.wordIndex += 1;
    }
    this.prevKeyWasSpace = true;
  }

  handleInputKey(event) {
    let correctKey = "";
    if (this.wordIC[this.wordIndex] < this.sampleArray[this.wordIndex].length) {
      correctKey = this.sampleArray[this.wordIndex].charAt(
        this.wordIC[this.wordIndex]
      );
    }

    if (correctKey !== event.key) {
      //User key error - must record and add to errorCount
      this.handleErrorKey(correctKey.toLowerCase());
    }

    this.wordIC[this.wordIndex] += 1;
    this.prevKeyWasSpace = false;
    this.setState({
      testStart: true
    });
  }

  addToWordErrorList(wordMissed) {
    if (!this.prevKeyWasSpace) {
      if (!(wordMissed in this.wordErrorList)) {
        this.wordErrorList[wordMissed] = 0;
      }
      this.wordErrorList[wordMissed] += 1;
    }
  }

  handleErrorKey(correctKey) {
    this.addToWordErrorList(this.sampleArray[this.wordIndex]);

    if (
      correctKey in this.errorList &&
      this.wordIC[this.wordIndex] < this.wordCount[this.wordIndex]
    ) {
      this.errorList[correctKey] += 1;
    } else {
      this.errorList[correctKey] = 1;
    }

    if (this.wordIC[this.wordIndex] < this.sampleArray[this.wordIndex].length) {
      this.errorLocations.push(
        this.wordCount[this.wordIndex] + this.wordIC[this.wordIndex]
      );
    }
    this.setState({
      errorCount: this.state.errorCount + 1
    });
  }

  handleBackSpace() {
    this.prevKeyWasSpace = false;
    if (this.wordIC[this.wordIndex] > this.sampleArray[this.wordIndex].length) {
      this.setState({
        errorCount: this.state.errorCount - 1
      });
    }
    if (this.wordIC[this.wordIndex] !== 0) {
      //Still on current word, no need to change to prev word
      this.wordIC[this.wordIndex] -= 1;
    } else if (this.wordIndex === 0) {
      //at first word, do nothing
    } else {
      //Change to prev word
      this.setState({
        errorCount: this.state.errorCount - this.spaceErrors[this.wordIndex - 1]
      });
      this.spaceErrors[this.wordIndex - 1] = 0;
      this.wordIndex -= 1;
    }
    if (
      this.errorLocations[this.errorLocations.length - 1] -
        this.wordCount[this.wordIndex] ===
      this.wordIC[this.wordIndex]
    ) {
      this.errorLocations.splice(-1, 1);
      this.setState({
        errorCount: this.state.errorCount - 1
      });
    }
  }

  updateTime(secs) {
    let elapsedTime = this.props.timeChoice - secs;
    let fractionOfCurWord = 0.5;

    if (this.wordIndex + 1 !== this.sampleArray.length)
      fractionOfCurWord =
        this.wordIC[this.wordIndex] /
        (this.wordCount[this.wordIndex + 1] - this.wordCount[this.wordIndex]);

    if (secs % 5 === 0 && elapsedTime != 0) {
      //time to update speed and accuracy data
      let idx = elapsedTime / 5 - 1;
      this.speedOverTime[idx] = this.state.currentSpeed; //index will = 0, 1, 2 ...

      let spaceErrorSum = 0
      for(var i = 0; i < this.spaceErrors.length; ++i){
        spaceErrorSum += this.spaceErrors[i]
      }
      let lenOfInput = this.state.input.length + spaceErrorSum;
      if (lenOfInput == 0) {
        lenOfInput = 1;
      } //To avoid divide by 0
      this.accOverTime[idx] = Math.floor(
        (lenOfInput - this.state.errorCount) / lenOfInput * 100
      );
    }

    let wpm = 60
    if(this.state.input.length != 0)
      wpm = Math.floor(this.state.input.length / 5 / elapsedTime * 60);
    this.setState({
      currentSpeed: wpm
    });
  }

  highlighted() {
    let wordIndex = this.state.wordIndex;
    let remainingWords = this.sampleArray.length - 1 - this.wordIndex;
    let past = this.sampleArray.slice(0, this.wordIndex).join(" ");
    let current = " " + this.sampleArray[this.wordIndex];
    let future = "";
    if (this.wordIndex < this.sampleArray.length - 1) {
      future = " " + this.sampleArray.slice(-1 * remainingWords).join(" ");
    }

    return (
      <div>
        <span style={{ opacity: 0.5 }}>{past}</span>
        <span style={{ color: "blue" }}>{current}</span>
        <span>{future}</span>
      </div>
    );
  }

  testIsOver() {
    // console.log('testIsOver')
    this.props.testHandler(this.state.currentSpeed, this.speedOverTime, this.accOverTime, this.errorList, this.wordErrorList)
    if(this.state.training && this.props.testNumber == 9){
      this.props.trainingIsOver()
    }
    this.setState({testOver: true})
  }

  render() {
    if (this.state.testOver === true) {
      return (
        <div>
          <MyContext.Consumer>
            {context => <div>{context.state.setData(this.errorList)}</div>}
          </MyContext.Consumer>
        </div>
      );
    }
    return (
      <div className="col-md-10 offset-md-1">
        <div className="row">
          <div className="col-md-9 card bg-light mb-3">
                <div className="card-header">
                  {this.state.training && <span> Training Test Level {this.props.testNumber+1}</span>}
                  {!this.state.training && <span> Practice Test</span>}
                  <div align="right" className="inline-div text-capitalize">Text Difficulty: {this.props.diffu} </div>
                  {this.props.changeTimeHandler?
                    <button type="button" className="btn btn-primary ml-2" onClick={this.props.changeTimeHandler} >Change Time</button>
                    : []}
                </div>
                <div className="card-body">
                  <div className="card-body">
            <div className="sampleInnerBox"><span>{this.highlighted()}</span></div>
            <div className="display-center sampleTextInput">
            <input
              align="middle"
              className="input"
              placeholder="Click here to start typing..."
              value={this.state.input}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyChange}
            />
          </div>
                  </div>
          </div>
          </div>
          <div className="col-md-2">
            <div className="display-center">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">Time Left</div>
                <div className="card-body">
                  <h5 className="card-title">
                    {this.props.timeChoice != 0 && <Timer className="small-display"
                      signal={this.state.testStart}
                      timeChoice={this.props.timeChoice}
                      callBack={this.updateTime}
                      callBack2={this.testIsOver}
                    />}
                  </h5>
                </div>
              </div>
              <div className="card text-white bg-secondary mb-3">
                <div className="card-header">Speed</div>
                <div className="card-body">
                  <h5 className="card-title">
                    {this.state.currentSpeed}
                  </h5>
                </div>
              </div>
              <div className="card text-white bg-secondary mb-3">
                <div className="card-header">Mistyped keystrokes</div>
                <div className="card-body">
                  <h5 className="card-title">
                    {this.state.errorCount}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tester;
