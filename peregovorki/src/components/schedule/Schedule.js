import React, { Component } from 'react';

import Rooms from './../rooms/Rooms';
import ScheduleDay from './../scheduleDay/ScheduleDay'

export default class Schedule extends Component {
	
	render() {
		//console.log("Schedule все props", this.props);

		return(
			
			<main className="schedule">
				<div className="wrapper schedule__layout">
					<div className="schedule__aside">
						<Rooms rooms={this.props.rooms} />
					</div>
					<div className="schedule__day">
						<ScheduleDay dayToDisplay={this.props.dateToDisplay} rooms={this.props.rooms} />
					</div>
				</div>
			</main>
		)
	}
}