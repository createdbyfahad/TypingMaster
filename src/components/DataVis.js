// Typing Master
// Last Edit: June 6th, 2018
// Authors: Ziming Guo

import React from 'react';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class DataVis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            speedOverTime: props.speedOverTime,
            accOverTime: props.accOverTime,
            errorKeys: props.errorKeys,
            wordErrors: props.wordErrors
        };
    }

    componentDidUpdate() {

    }

    render() {

        let length = this.state.speedOverTime.length;

        //for both line charts
        var lineChartData = []
        for (var i=0; i< length; i++){

            let time_second = (i+1)*5
            var time = time_second.toString() + "s"
            var item = {"time":time, "speed": this.state.speedOverTime[i], "accuracy":this.state.accOverTime[i]}
            lineChartData.push(item)
        }


        //for errword

        var errwordChart = []
        var errword=this.state.wordErrors
        let errwordlength = Object.keys(this.state.wordErrors).length

        var items = Object.keys(errword).map(function(key) {
            return [key, errword[key]];
        });

        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        for (var i=0; i< 6; i++){
            var worditem = {}
            if (i < errwordlength){

                worditem = {"word": items[i][0], "times": items[i][1]}
                errwordChart.push(worditem)
            }
            else{
                worditem = {"word": "", "times": 0}
                errwordChart.push(worditem)
            }
        }
        //for errletter


        var errletterChart = []
        var errletter=this.state.errorKeys
        let errletterlength = Object.keys(this.state.errorKeys).length

        var items2 = Object.keys(errletter).map(function(key) {
            return [key, errletter[key]];
        });

        items2.sort(function(first, second) {
            return second[1] - first[1];
        });


        
        for (var i=0; i< 6; i++){
            var letteritem = {}
            if (i < errletterlength){

                if (items2[i][0] == ""){
                    letteritem = {"letter": "space", "times": items2[i][1]}
                }
                else{
                    letteritem = {"letter": items2[i][0], "times": items2[i][1]}
                }

                errletterChart.push(letteritem)
            }
            else{
                letteritem = {"letter": "", "times": 0}
                errletterChart.push(letteritem)
            }
        }

        // const data = [
        //     {time: '5s', speed: 70, accuracy: 0.99, amt: 2400},
        //     {time: '10s', speed: 68, accuracy: 0.87, amt: 2210},
        //     {time: '15s', speed: 65, accuracy: 0.89, amt: 2290},
        //     {time: '20s', speed: 60, accuracy: 0.77, amt: 2000},
        //     {time: '25s', speed: 55, accuracy: 0.80, amt: 2181},
        //     {time: '30s', speed: 56, accuracy: 0.86, amt: 2500},
        //     {time: '35s', speed: 63, accuracy: 0.88, amt: 2100}
        // ];

        // const data2 = [
        //     { subject: 'the', A: 1,  fullMark: 100 },
        //     { subject: 'word', A: 1,  fullMark: 100 },
        //     { subject: 'Sure', A: 1, fullMark: 100 },
        //     { subject: 'course', A: 1,  fullMark: 100 },
        //     { subject: 'might', A: 2,  fullMark: 100 },
        //     { subject: 'A', A: 1,  fullMark: 100 },
        // ];

        return (
            <div className='background'>

                <div className='upperdiv'>

                    <div className='leftdiv'>
                        <p className='p'>Most frequently mistyped words</p>

                        <BarChart width={350} height={200} data={errwordChart}
                                  margin={{top: 10, right: 30, left: 30, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="word"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend />
                            <Bar dataKey="times" fill="#8884d8" />

                        </BarChart>


                    </div>

                    <div className='rightdiv'>
                        <p className='p'> Your final accuracy is {this.state.accOverTime[length-1]}%. </p>

                        <LineChart width={350} height={200} data={lineChartData}
                                   margin={{top: 10, right: 30, left: 30, bottom: 5}}>
                            <XAxis dataKey="time"/>
                            <YAxis/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip/>
                            <Legend />
                            <Line type="monotone" dataKey="accuracy" stroke="#8884d8" activeDot={{r: 8}}/>
                        </LineChart>
                    </div>

                </div>

                <div className='lowerdiv'>
                    <div className='leftdiv'>
                        <p className='p'>Most frequently mistyped letters</p>

                        <BarChart width={350} height={200} data={errletterChart}
                                  margin={{top: 10, right: 30, left: 30, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="letter"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend />
                            <Bar dataKey="times" fill="#8884d8" />

                        </BarChart>
                    </div>

                    <div className='rightdiv'>
                        <p className='p'> Your average speed is {this.state.speedOverTime[length-1]} WPM. </p>

                        <LineChart width={350} height={200} data={lineChartData}
                                   margin={{top: 10, right: 30, left: 30, bottom: 5}}>
                            <XAxis dataKey="time"/>
                            <YAxis/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip/>
                            <Legend />
                            <Line type="monotone" dataKey="speed" stroke="#8884d8" activeDot={{r: 8}}/>
                        </LineChart>
                    </div>

                </div>
            </div>
        )
    }
}

export default DataVis;