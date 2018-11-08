// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi, Ben Martinson

import axios from 'axios';

// add single record to user records
export function addRecord(dataObj){
	axios.post('/api/record/add', dataObj)
    .then((result) => {
      // user successfully logged in
      // jwt token is used each time the user requests something from the server
      // update the app component and redirect to main page
      return true;
    })
    .catch((error) => {
      console.log(error)
      if(error.response && error.response.status === 401) {
        console.log(error)
      }
    });
}

// called when user success in level of training
export function updateTrainData(dataObj){
	// let ret = false
	  axios.post('/api/record/trainingData/add', dataObj)
      .then((result) => {
        // user successfully logged in
        // jwt token is used each time the user requests something from the server
        // update the app component and redirect to main page
        // console.log(result)
        // ret = true
      })
      .catch((error) => {
        console.log(error)
        if(error.response && error.response.status === 401) {
          console.log(error)
        }
      });
     // return ret
}

// reset train info
export function resetTrainingData(callback){
	  axios.post('/api/record/trainingData/reset', {})
      .then((result) => {
        // user successfully logged in
        // jwt token is used each time the user requests something from the server
        // update the app component and redirect to main page
        // console.log(result)
        // ret = true
        callback({
          currentLevel: 0,
          trainingData: []
        })
      })
      .catch((error) => {
        console.log(error)
        if(error.response && error.response.status === 401) {
          console.log(error)
        }
      });
}

// return (to callback function) the user's train info
export function getTrainStatus(callback){
    axios.post('/api/record/trainingData', {})
      .then((res) => {
        // get the training value and put it with state
				let level = res.data.currentLevel
				let diff = '';
				if(level % 3 == 0) diff = 'easy'
				else if(level % 3 == 1) diff = 'medium'
				else diff = 'hard'

				level += 1;
				// console.log('level = ' + level)
				let timeChoice = 0
				if(level < 3) timeChoice = 60
				else if(level < 6) timeChoice = 180
				else if(level < 9) timeChoice = 300
				else timeChoice = 420

        callback({
            currentLevel: res.data.currentLevel,
            trainingData: res.data.trainingData,
						diffu: diff,
						timeChoice: timeChoice
        })

      }).catch((error) => {
        if(error.response && error.response.status === 401) {
          console.log("error", error.response)
        }
      });
}


// get all user's records
export function getAllRecords(callback){
    // get all records of the user
    axios.get('/api/record/all', {})
    .then((result) => {
      // update state
      callback(result.data)
    })
    .catch((error) => {
      console.log(error)
      if(error.response && error.response.status === 401) {
        console.log(error)
      }
    });
  }
