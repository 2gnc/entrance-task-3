import React, { Component } from 'react';
import moment from 'moment';
import gql from 'graphql-tag';
import Header from './components/header/Header'
import Timing from './components/timing/Timing'
import ScheduleWrapper from './components/scheduleWrapper/ScheduleWrapper';

export default class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			dayToDisplay: moment(),
		};
		this.dateHandler = this.dateHandler.bind(this);
	}
	
	dateHandler(data) {
		console.log( "App состояние" );
		this.setState({
			dayToDisplay: data,
		});
	}
	
	render() {
		let x = moment().format('mm');

		console.log( x );

		let hasButton = true;
		console.log( "App состояние", this.state );
		return (
			<div className="App__wrapper">
				<Header hasButton = {hasButton} />
				<Timing parent={this}  />
				<ScheduleWrapper dateToDisplay={this.state.dayToDisplay} />
			</div>
		);
	}
};