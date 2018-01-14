import React, { Component } from 'react';
import moment from 'moment';
import Timeslot from "../timeslot/Timeslot"

export default class ScheduleDay extends Component {
	
	render() {
		console.log("Schedule day", this.props);
		
		let rooms = this.props.rooms;
		//console.log( this.context );
		
		//access = (age > 14) ? true : false;
		
		function makeSlots() {
			let now = +moment().format('HH');
			let arr = [];
			let cl = '';
			for( let i = 0; i <= 16; i++ ) {
				if( i === 0 ) {
					cl = "schedule__timeslot schedule__timeslot--first";
					arr.push( <Timeslot position={cl} key={i} disabled={true} rooms={rooms} spec="isfirst" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				} else if( i === 16 ) {
					cl = "schedule__timeslot schedule__timeslot--last";
					arr.push( <Timeslot position={cl} key={i} disabled={true} rooms={rooms} spec="islast" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				} else {
					cl="schedule__timeslot";
					arr.push ( <Timeslot position={cl} key={i} disabled={false} rooms={rooms} spec="ismid" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				}
			}
			return arr;
		}
		
		let timeslots = makeSlots();

		
		return (
				<div className = "schedule__chart">
					{timeslots}
				</div>
		)
	}
}


