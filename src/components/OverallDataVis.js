// Typing Master
// Last Edit: June 6th, 2018
// Authors: Ziming Guo

import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class OverallDataVis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            speedOverTime: props.speedOverTime,
            accOverTime: props.accOverTime,
            testDates: props.testDates
        };
    }

    componentDidUpdate() {

    }

    render() {

        let length = this.state.speedOverTime.length;

        //for both line charts
        var lineChartData = []
        for (var i=0; i< length; i++){

            let time_second = (i+1)
            var item = {"time":this.state.testDates[i], "speed": this.state.speedOverTime[i], "accuracy":this.state.accOverTime[i]}
            lineChartData.push(item)
        }


        return (
            <div className='background'>

                <div className='overallupperdiv'>
                    <p className='overallp'> Tests Accuracy Over Time (X-Axis: Test Date, Y-Axis: Accuracy) </p>

                    <LineChart width={800} height={200} data={lineChartData}
                               margin={{top: 10, right: 100, left: 10, bottom: 5}}>
                        <XAxis dataKey="time"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke="#8884d8" activeDot={{r: 8}}/>
                    </LineChart>


                </div>

                <div className='overalllowerdiv'>
                    <p className='overallp'> Tests Average Speed Over Time (X-Axis: Test Date, Y-Axis: Speed) </p>

                    <LineChart width={800} height={200} data={lineChartData}
                               margin={{top: 10, right: 100, left: 10, bottom: 5}}>
                        <XAxis dataKey="time"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="speed" stroke="#8884d8" activeDot={{r: 8}}/>
                    </LineChart>


                </div>
            </div>
        )
    }
}

export default OverallDataVis;