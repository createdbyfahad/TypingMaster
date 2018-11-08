// Typing Master
// Last Edit: June 6th, 2018
// Authors: Ben Martinson

import React, { Component } from 'react'

export const MyContext = React.createContext()


// used to store data that need to be accessed from differen parts of the app
export default class MyProvider extends Component {
  state = {
    currentSample: "This is sample text",
    setData: (data) => {return (
        <div>
          {this.state.currentSample}
        </div>
      )}
  }
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
      }}>
        {this.props.children}
      </MyContext.Provider>
    )

  }
}
