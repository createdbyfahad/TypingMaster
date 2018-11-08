// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi, Ben Martinson

import React, { Component } from 'react'

class About extends Component {

  constructor(props) {
    super(props);
  }

 render() {
   return (
    <div>
      <div>
        <h1>Main idea</h1>
        <p>   There are many typing tests out there. Typing Master is set apart by the ease of use and the
           number of features available. While taking a test, speed and accuracy is recorded every 5 secs,
           along with keystroke errors and misspelled words. This data is processed after the test concludes and can be
           viewed in the form of graphs and barcharts.
        </p>
        <p>
            The test taking process is very fluid, making a mistake does not stop you from continuing with the test,
            as you would when typing normally. You are able to make mistakes and move on without finishing them.
           Hitting the spacebar will move on to the next word, if you've typed at least one character in the
           word. This provides the ability to move on quickly when a word you typed feels like it's beyond fixing,
           but doing so will negatively affect your accuracy data.
        </p>
        <p>
           Typing Master design decisions were chosen based on what we believed would create the most useful and enjoyable
           experience for our users.
        </p>
        <br />
        <br />
        <h1>
          Why Register?
        </h1>
        <p>
            Typing Master allows users to provide log in information. Doing so opens up additional features;
            Training and Tracking. The training section is built around the idea that accuracy is important and
            speed doesn't mean much if you're not typing the correct keys. A series of 10 training tests are given,
            and the goal of each test is to get above 90% accuracy. Moving on to the next test requires
            achieving this goal. The tests alternate in text difficulty from easy, medium, and hard and
            the length of the test increases as you go (4 different lengths).
        </p>
        <p>
            The tracking section provides overall data from previous tests. Graphs of average speed and accuracy
            are shown to provide a way to view your progress in a visually interesting way. Progress
            is important to the process of learning how to type well, and we hope you find our app helpful in this
            regard.
        </p>

      </div>
    </div>
   )
 }
}

export default About;
