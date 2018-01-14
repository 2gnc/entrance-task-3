import React, { Component } from 'react';
import Floorslot from '../floorslot/Floorslot';
import Rowslot from '../rowslot/Rowslot';
import Now from '../now/Now';
import Floor from "../floor/Floor";

export default class Timeslot extends Component {
	render() {
		//this.props.rooms
		//console.log( this.props );
		//isnow ()true/false
		
		let time = this.props.time;
		//console.log(this.props.time, this.props.isnow);
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
		let x = (now ? <Now/> : '');
			
			//console.log(this.props);
		
		return (
			<div className={this.props.position} disabled={this.props.disabled} data-time={this.props.time} data-now={this.props.isnow} >
				{floorslots}
				{x}
			</div>
		)
	}
}