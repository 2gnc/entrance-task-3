import React, { Component } from 'react';

export default class Icon extends Component {

	render() {
		return (
			<div className={`icon ${ this.props.modificator }`}></div>
		)
	}
}