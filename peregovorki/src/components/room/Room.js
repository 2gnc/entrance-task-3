import React, { Component } from 'react';

export default class Room extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isSelected: this.props.isSelected,
		};
	}

	render() {
		let modifier = '';
		if( this.state.isSelected === true ) {
			modifier = ' recomendation--selected';
		}

		if (this.props.layout === "infloors") {
			return (
				<div className="room" data-roomid={this.props.datay}>
					<div className="room__name">{this.props.name}</div>
					<div className="room__desc">{"Вместимость: " + this.props.cap + " чел." } </div>
				</div>
			)} else if (this.props.layout === "inrecomendations") {
			return (
					<div className={"recomendation" + modifier} data-roomid={this.props.roomId} >
						<span className="recomendation__time">16:00 &ndash; 16:30</span>
						<span className="recomendation__room">
							{this.props.name} &middot; {this.props.number + " этаж" }
							</span>
					</div>
				)
		}
	}
}