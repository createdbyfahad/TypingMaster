// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi, Ben Martinson

import React, { Component } from 'react'
import axios from 'axios';
import { getAllRecords } from '../helpers/api'
import moment from 'moment'

import OverallDataVis from './OverallDataVis'



// the row of list view
function RecordRow(props){
	return (
		<tr>
	      <td>{moment(props.data.date).fromNow()}</td>
	      <td>{props.data.speed}</td>
	      <td>{props.data.accuracy}</td>
	    </tr>
	)
}


// component used to show the records table
function RecordsTable(props){
	let records = []
	if(props.data){
		for(var i = props.data.length-1; i >= 0; i--){
			records.push(<RecordRow key={props.data.length-i} data={props.data[i]} />)
		}
	}

	return (
		<table className="table">
		  <thead>
		    <tr>
		      <th scope="col">When</th>
		      <th scope="col">Speed(WPM)</th>
		      <th scope="col">Accuracy(%)</th>
		    </tr>
		  </thead>
		  <tbody>{records}</tbody>
		</table>)
}

class Track extends Component {

	constructor(props){
		super(props);
		this.state = {data: null, showOverallDataVis: false, testDates: [], speedList: [], accList: []}
		this.retrieveRecords = this.retrieveRecords.bind(this)
	}

	retrieveRecords(data){
		// first set up the lists for overall data viz
		
		var testDates = []
		var speedList = []
		var accList = []

		for(var i = 0; i < data.length; i++){
			testDates.push(moment(data[i].date).format("M/D"))
			speedList.push(data[i].speed)
			accList.push(data[i].accuracy)
		}

		// second set the state to new data
		this.setState({data: data, showOverallDataVis: true, testDates: testDates, speedList: speedList, accList: accList})
	}
	componentDidMount(){
		// get all records from server and update state
				getAllRecords(this.retrieveRecords)

	}




	render(){
		return (
			<div>
				<h2>Track Your Typing Performance</h2>
				<br />
				<nav className="nav nav-pills nav-justified col-md-6 offset-md-3 trackMenu">
				  <a className={"nav-item nav-link mr-1" + (this.state.showOverallDataVis? " active": " border")} onClick={() => this.setState({showOverallDataVis: true})}>Graph</a>
				  <a className={"nav-item nav-link" + (!this.state.showOverallDataVis? " active": " border")} onClick={() => this.setState({showOverallDataVis: false})}>List</a>
				</nav>
				{this.state.showOverallDataVis && <OverallDataVis testDates={this.state.testDates} speedOverTime={this.state.speedList} accOverTime={this.state.accList}/>}
				{!this.state.showOverallDataVis && <RecordsTable data={this.state.data}/>}
			</div>)
	}

}



export default Track;