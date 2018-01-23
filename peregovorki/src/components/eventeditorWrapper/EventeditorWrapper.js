import React, { Component } from 'react';
import Eventeditor from '../eventeditor/Eventeditor';

export default class EventeditorWrapper extends Component {

	render() {

		let eventToDownload = () => {
			if ( this.props.params.eventId ) {
				return this.props.params.eventId;
			} else {
				return '';
			}
		};
		
		return (
			<Eventeditor parent = {this} eventToDownload = {eventToDownload()}  />
			)
			
	}
}
