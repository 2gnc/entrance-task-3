import React, { Component } from 'react';
import moment from 'moment';
import TimelineItem from './../timelineItem/TimelineItem'

export default class Timeline extends Component {

	render() {
		
		let timeslots = [];
		let times = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
		let currentTime = this.props.currentDay;
		let position = "";
		let coord = 1;
		let isInPast = "";
		let time = "";
		
		//если дата в прошлом
		if(currentTime.isBefore(moment(), 'day')) {
			
			isInPast = "schedule__hour--past";
			for (let i = 0; i <16; i++) {
				if( i === 0 ) {
					time = times[i];
					position = "schedule__time--first";
				} else if (i === 16) {
					time = times[i];
					position = "schedule__time--last";
				} else {
					time = times[i];
					position = "";
				}
				
				timeslots.push(<TimelineItem time = {time} key={i} position={position} gone={isInPast} day = {currentTime} coord={i+7} />);
 			}
		
		//если дата сегодня
		} else if ( currentTime.isSame( moment(), 'day' )) {
			
			for (let i = 0; i <16; i++) {
				
				if ( +times[ i ] < +moment ().format ( "HH" ) ) {
					
					isInPast = "schedule__hour--past";
				} else {
					isInPast = "";
				}
				
				if( i === 0 ) {
					time = times[ i ];
					position = "schedule__time--first";
					
				}
				 else if (i === 16) {
					time = times[i];
					position = "schedule__time--last";
					
				} else {
					time = times[i];
					position = "";
					
				}
				
				timeslots.push(<TimelineItem time = {time} key={i} position={position} gone={isInPast} day = {currentTime} coord={i+7}/>);
			}
		
		//если дата в будущем
		} else {
			
			isInPast = "";
			for (let i = 0; i <16; i++) {
				if( i === 0 ) {
					time = times[i];
					position = "schedule__time--first";
				} else if (i === 16) {
					time = times[i];
					position = "schedule__time--last";
				} else {
					time = times[i];
					position = "";
				}
				
				timeslots.push(<TimelineItem time = {time} key={i} position={position} gone={isInPast} day = {currentTime} coord={i+7}/>);
			}
		
		}
		
		return (
			<div className="timing__timeline">
				{timeslots}
			</div>
		)
	}
}