import React, { Component } from 'react';
import Dayline from '../dayline/Dayline';
import Timeline from '../timeline/Timeline';
import moment from 'moment';

export default class Timing extends Component {
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
		this.props.parent.dateHandler(data);
	}
	
	render() {
		return(
			<div className="timing">
				<div className="wrapper timing__layout">
					<Dayline parent={this} />
					<Timeline currentDay={this.state.dayToDisplay} />
				</div>
			</div>
		)
	}
}