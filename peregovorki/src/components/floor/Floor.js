import React, { Component } from 'react';
import Room from '../room/Room'

class Floor extends Component {
	
	render() {
		let rooms = this.props.rooms.map(
			(items, i) => {
				return (
					<Room name={items.title} key={i} cap = {items.capacity} datay={items.id } layout="infloors" />
				)
			}
		);
		return (
			<div className = "rooms__floor">
				<div className = "rooms__floor-name" data-y = {this.props.number} >{this.props.number + " ЭТАЖ" }</div>
				<div>
					{rooms}
				</div>
			</div>
		)
	}
}

export default Floor;