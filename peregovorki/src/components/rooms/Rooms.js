import React, { Component } from 'react';
import Floor from '../floor/Floor';

export default class Rooms extends Component {

	render() {
	
	let floors = this.props.rooms.map(
		(items, i) => {
			let rooms = items.rooms;
			return <Floor number={i} key={i} rooms={rooms} />
		}
	);
	
	//console.log("Rooms все пропсы", this.props);
	
	return (
		<div className = "rooms">
			{floors}
		</div>
		
		)
	}
}
