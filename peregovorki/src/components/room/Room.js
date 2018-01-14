import React, { Component } from 'react';

export default class Room extends Component {
	render() {
		return (
			<div className="room" data-roomid={this.props.datay}>
				<div className="room__name">{this.props.name}</div>
				<div className="room__desc">{"Вместимость: " + this.props.cap + " чел." } </div>
			</div>
		)
	}
}