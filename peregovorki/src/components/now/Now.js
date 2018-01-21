import React, { Component } from 'react';
import moment from 'moment';

export default class Now extends Component {
	render() {
		
		let current = moment().format('HH:mm');
		
		function getClass() {
			let interval = 5 * 60 * 1000;
			let x = moment(Math.ceil(moment() / interval) * interval).format('mm');
			return x;
		}
		
		let time = getClass();
		
		function getModifier() { //TODO рассчитывать высоту динамически
			if(time === '05') {
				return "now--right1"
			} else if (time === '10') {
				return "now--right2"
			} else if (time === '15') {
				return "now--right3"
			} else if (time === '20') {
				return "now--right4"
			} else if (time === '25') {
				return "now--right5"
			} else if (time === '30') {
				return "now--right6"
			} else if (time === '35') {
				return "now--right7"
			} else if (time === '40') {
				return "now--right8"
			} else if (time === '45') {
				return "now--right9"
			} else if (time === '50') {
				return "now--right10"
			} else if (time === '55') {
				return "now--right11"
			} else {return "now--right12"}
		}
		
		let modifier = getModifier();
		
		return(
			<div className={"now " + modifier}>
				<div className="now__time ">{current}</div>
				<div className="now__line"></div>
			</div>
		)
	}
}