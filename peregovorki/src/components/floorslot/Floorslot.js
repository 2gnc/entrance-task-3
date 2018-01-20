import React, { Component } from 'react';
import Rowslot from '../rowslot/Rowslot'

export default class Floorslot extends Component {
	render () {
		return (
			<div className="schedule__floorslot">
				<Rowslot addname="schedule__rowslot--floor"/>
				{this.props.rooms}
			</div>
		)
	}
}