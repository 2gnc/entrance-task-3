import React, { Component } from 'react';

export default class TimelineItem extends Component {
	
	render() {
		return (
			<div className = {`schedule__time ${this.props.position}`}  data-x = {this.props.coordX} >
				<span className = {`schedule__hour ${ this.props.gone }`}> {this.props.time} </span>
			</div>
		
		)
	}
}