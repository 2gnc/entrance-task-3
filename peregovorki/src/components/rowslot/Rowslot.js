import React, { Component } from 'react';

export default class Rowslot extends Component {
	render () {
		let pasteId = isNaN(this.props.room + this.props.time) ;
		
		if( !pasteId ) {
			return ( <div className={"schedule__rowslot " + this.props.addname} data-time={this.props.time} data-room={this.props.room} id={this.props.room + this.props.time} /> )
		} else {
			return ( <div className={"schedule__rowslot " + this.props.addname} data-time={this.props.time} data-room={this.props.room} /> )
		}
	}
}