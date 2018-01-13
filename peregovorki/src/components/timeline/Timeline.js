import React, { Component } from 'react';
import moment from 'moment';
import TimelineItem from './../timelineItem/TimelineItem'

export default class Timeline extends Component {

	render() {
		
		let timeslots = [];
		let times = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
		let currentTime = moment();
		let position = "schedule__time--first";
		let coord = 1;
		let isInPast = "schedule__hour--past";
		let time = "";
		
		
		
		for(let i = 0; i <= 16; i++){
			if( i === 0 ) {
				time="8:00"
			} else {
				time = times[i]
			};
			timeslots.push(<TimelineItem time = {time} key={i} />);
		}
		
		return (
			<div className="timing__timeline">
				{timeslots}
				<TimelineItem position={position} coordX={coord} time={time} gone={isInPast} />
			</div>
		)
	}
}