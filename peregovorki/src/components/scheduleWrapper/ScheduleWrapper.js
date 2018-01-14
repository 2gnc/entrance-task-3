import React, { Component } from 'react';
import Schedule from './../schedule/Schedule'

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class ScheduleWrapper extends Component {
	
	constructor (props) {
		super (props);
	}
	
	render () {
		
		if(!this.props.data.rooms) {
			return null;
		}
		
		//промежуточный массив этажей
		let flo = this.props.data.rooms.map(
			function( item ) {
				return item.floor;
			}
		);
		
		function unic (arr) {
			let obj = {};
			for (let i = 0; i < arr.length; i++) {
				let str = arr[i];
				obj[str] = true;
			}
			return Object.keys(obj);
		}
		//список уникальных этажей
		let unicFloor = unic(flo);
		
		//список комнат
		let rooms = this.props.data.rooms;
		
		//массив с объектами (разложили комнаты по этажам)
		let floorsAndRooms = unicFloor.map(
			(item) => {
				let obj = {
					floor: item,
					rooms: []
				};
				rooms.forEach(
					function(things, i, arr) {
						if(things.floor === +item ) {
							obj.rooms.push(things);
						}
					}
				);
				return obj
			}
		);
		
		//console.log("wrapper пропс, ", this.props.dateToDisplay);
		console.log( "App перерисовал ScheduleWrapper" );
		console.log("Schedule Wrapepr props", this.props);
		console.log( floorsAndRooms );
		
		return (
			<Schedule dateToDisplay={ this.props.dateToDisplay } rooms={floorsAndRooms} />
		)
	}
}

export default graphql(gql`query{rooms {id floor title capacity }}`, {})(ScheduleWrapper);