import React, { Component } from 'react';

export default class IconClose extends Component {
	
	clicker () {
		console.log("клац");
	}
	
	render () {
		
		return (
			<div className={`icon icon--close icon--nomob`} onClick={this.clicker}>
			</div>
		)
	}
}