import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import Header from './components/header/Header'
import Timing from './components/timing/Timing'
import Schedule from './components/schedule/Schedule'

class App extends Component {
	constructor( props ) {
		super( props );
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
		let dateToDisplay = this.state.dayToDisplay;
		let hasButton = true;
		return (
			<div className="App__wrapper">
				<Header hasButton = {hasButton} />
				<Timing parent={this}  />
				<Schedule parent={this} dateToDisplay={dateToDisplay} />
			</div>
		);
	}
};


//для компонентов, использующих данные
export default graphql(gql`{ users {id, login } }`, {})(App);
