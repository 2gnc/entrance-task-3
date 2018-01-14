import React, { Component } from 'react';
import Rowslot from '../rowslot/Rowslot'

export default class Floorslot extends Component {
	render () {
		//console.log( "floorslot", this.props);
		return (
			<div className="schedule__floorslot">
				<Rowslot addname="schedule__rowslot--floor"/>
				{this.props.rooms}
			</div>
		)
	}
}