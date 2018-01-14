import React, { Component } from 'react';

export default class EventParticipants extends Component {
	render() {
		console.log(this.props);
		return (
			<div className="event__participants">
				{this.props.users}
			</div>
		)
	}
}

