import React, { Component } from 'react';


export default class Icon extends Component {
	
	constructor(props) {
		super(props);
		this.clicker = this.clicker.bind(this);
	}
	
clicker() {
	
	if(this.props.modificator === "icon--arrl") {
		this.props.callback.setState({currentDate: this.props.callback.state.currentDate.subtract(1, 'days') });
	}
	else {
		this.props.callback.setState({currentDate: this.props.callback.state.currentDate.add(1, 'days') });
	}
	
	this.props.callback.props.parent.dateHandler(this.props.callback.state.currentDate);
	
	
}
	
	render() {
		return (
			<div className={`icon ${ this.props.modificator }` } onClick={ this.clicker } ></div>
		)
	}
}