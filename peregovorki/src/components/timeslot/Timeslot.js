import React, { Component } from 'react';
import Floorslot from '../floorslot/Floorslot';
import Rowslot from '../rowslot/Rowslot';
import Now from '../now/Now';

export default class Timeslot extends Component {
	render() {
		
		let time = this.props.time;

		let floorslots = this.props.rooms.map(
			(items, i) => {
				let roomsinfloor =[];
				items.rooms.map(
					(roo, i) => {
						roomsinfloor.push(
							<Rowslot addname={''} key={i} time={time} room={ roo.id } />
						);
					}
				);
				return (
					<Floorslot key={i} rooms={roomsinfloor} />
				)
			}
		);
		let now = this.props.isnow;
		let x = ( now && this.props.isToday ? <Now/> : null);
		return (
			<div className={this.props.position} disabled={this.props.disabled} data-time={this.props.time} data-now={this.props.isnow} >
				{floorslots}
				{x}
			</div>
		)
	}
}