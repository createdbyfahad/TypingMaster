// Typing Master
// Last Edit: June 6th, 2018
// Authors: Ben Martinson

import React from 'react'


class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: {},
      seconds: this.props.timeChoice
    }

    this.timer = 0;
    this.startCountdown = this.startCountdown.bind(this);
    this.setTheTimeInterval = this.setTheTimeInterval.bind(this);
  }

  componentDidMount() {
    var timeRemain = this.secondsToMins(this.props.timeChoice);
    this.setState({ time: timeRemain });
  }


  secondsToMins(secs){
    var minsD = secs % (3600);
    var minutes = Math.floor(minsD / 60);
    var secsD = minsD % 60;
    var seconds = Math.ceil(secsD);
    minutes = minutes.toString()
    seconds = seconds.toString()
    if(seconds < 10)
      seconds = '0' + seconds

    if(secs >= 0)
      this.props.callBack(secs)

    return {"m":minutes, "s": seconds}
  }



  setTheTimeInterval() {
    var seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToMins(seconds),
      seconds: seconds,
    });

    if (seconds === 0){
      clearInterval(this.timer);
      this.props.callBack2()
    }

  }

  startCountdown() {
    if (this.timer === 0) {
      this.timer = setInterval(this.setTheTimeInterval, 1000);
    }
  }

  render() {
    if(this.props.signal === false){
      return (
        <div>
          {this.state.time.m} : {this.state.time.s}

        </div>
      )
    }

    return(
      <div>
        {this.startCountdown()}
        {this.state.time.m} : {this.state.time.s}
      </div>
    );
  }
}

export default Timer
