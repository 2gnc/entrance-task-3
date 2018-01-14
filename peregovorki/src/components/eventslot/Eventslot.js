import React, { Component } from 'react';


export default class Eventslot extends Component {
	
	// Пропсы: room(id),
	//      is empty
	//      partofhour
	//      modifier('...'), - на основании первых двух пропсов
	// 		eventid(null/id)
	// 		hours[{hour, part(1-12)},{}]
	
	render() {
		return(
			<div className="App__wrapper">
				<div className="schedule__innerslot"></div>
			</div>
		)
	}
	
}