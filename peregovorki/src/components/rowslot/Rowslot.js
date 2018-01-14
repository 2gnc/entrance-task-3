import React, { Component } from 'react';

export default class Rowslot extends Component {
	render () {
		return (
			<div className={"schedule__rowslot " + this.props.addname} data-time={this.props.time} data-room={this.props.room} >
				{this.props.children}
			</div>
		)
	}
}