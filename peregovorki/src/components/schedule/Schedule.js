import React, { Component } from 'react';
import moment from 'moment';


import Rooms from './../rooms/Rooms'

export default class Schedule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dayToDisplay: moment(),
		};
		this.dateHandler = this.dateHandler.bind(this);
	}
	
	dateHandler(data) {
		this.setState({
			dayToDisplay: data,
		});
	}
	
	render() {
		return(
			
			<main className="schedule">
				<div className="wrapper schedule__layout">
					<div className="schedule__aside"><Rooms /></div>
					<div className="schedule__day">2</div>
				</div>
			</main>
		)
	}
}