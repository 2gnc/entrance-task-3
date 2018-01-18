import React, { Component } from 'react';
import Icon from '../elements/Icon';
import moment from 'moment';
import Datepick from '../elements/Datepick';

export default class Dayline extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			currentDate: moment()
		};
	}
	
	dateHandler(data) {
		
		this.setState({
			currentDate: data
		});
		this.props.parent.dateHandler(data);
		
	}
	
	render() {

		let needCurrent;
		let datepicker = <Datepick className = '' parent = {this} daySelected = {this.state.currentDate}  />;
		let iconLeft = <Icon modificator="icon--arrl" parent = {this} currentDay={this.state.currentDate} />;
		let iconRight = <Icon modificator="icon--arrr" parent = {this} currentDay={this.state.currentDate} />;
		
		if( this.state.currentDate.isSame(this.state.today, 'day' )) {
			needCurrent = (<label className="timing__label" htmlFor="datetoday">Сегодня</label>);
		}
		
		return(
			<div className="timing__dayline">
				<div className="timing__day-to-display">
					{iconLeft}
					<div className="timing__date">
						{datepicker}
						{needCurrent}
					</div>
					{iconRight}
				</div>
			</div>
		)
	}
}