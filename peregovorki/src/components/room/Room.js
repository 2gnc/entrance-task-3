import React, { Component } from 'react';

export default class Room extends Component {
	constructor( props ) {
		super( props );
		this.getModifier = this.getModifier.bind(this);
		this.getName = this.getName.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getDesc = this.getDesc.bind(this);
		this.getId = this.getId.bind(this);
		this.getFloor = this.getFloor.bind(this);
	}
	getModifier() {
		if( this.props.isSelected ) {
			return ' recomendation--selected';
		} else {
			return ('');
		}
	}
	getName() {
		if( this.props.name ) {
			return this.props.name;
		} else {
			return 'Неизвестно';
		}
	}
	getCoords() {
		if( this.props.datay ) {
			return this.props.datay;
		} else {
			return '';
		}
	}
	getDesc() {
		if(this.props.cap) {
			return (
				'Вместимость: ' + this.props.cap + ' чел.'
			)
		} else {
			return ('Непонятно на сколько человек');
		}
	}
	getId() {
		if(this.props.roomId) {
			return this.props.roomId;
		} else {
			return '';
		}
	}
	getFloor() {
		if( this.props.floor ){
			return (
				this.props.floor + ' этаж'
			)
		} else {
				return (
					'неизвестно где'
				);
			}
		}
		render() {
		if (this.props.layout === 'infloors') {
			return (
				<div className='room' data-roomid={this.getCoords()}>
					<div className='room__name'>{this.getName()}</div>
					<div className='room__desc'>{this.getDesc()} </div>
				</div>
			)} else if (this.props.layout === 'inrecomendations') {
			return (
					<div className={'recomendation' + this.getModifier() } data-roomid={this.props.roomId} >
						<span className='recomendation__time'>16:00 &ndash; 16:30</span>
						<span className='recomendation__room'>
							{this.props.name} &middot; {this.getFloor()}
							</span>
					</div>
				)
		}
	}
}