import React, { Component } from 'react';

export default class Icon extends Component {
	constructor ( props ) {
		super ( props );
		
		this.state = {
			currentDate: this.props.currentDay
		};
		
		this.clicker = this.clicker.bind ( this );
	}
	
	clicker () {
		
		if(this.props.modificator === "icon--arrl") {
			console.log("влево", this.props.parent);
			
			this.setState({
				currentDate: this.props.currentDay.subtract( 1, 'days' )
			});
			this.props.parent.dateHandler(this.props.currentDay);
			this.props.parent.setState({
				currentDate: this.props.currentDay
			});
		} else {
			console.log("вправо");
			this.setState({
				currentDate: this.props.currentDay.add( 1, 'days' )
			});
			this.props.parent.dateHandler(this.props.currentDay);
			this.props.parent.setState({
				currentDate: this.props.currentDay
			});
		}
		
	}
	
	render () {
		//console.log ( "Icon props", this.props );
		//console.log ( "Icon state", this.state );
		
		return (
			<div className={`icon ${ this.props.modificator }`} onClick={this.clicker}>
			
			</div>
		)
	}
}