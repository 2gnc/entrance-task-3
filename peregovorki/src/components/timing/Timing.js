//обертка
import React, { Component } from 'react';
import Dayline from './dayline/Dayline';

export default class Timing extends Component {
	render() {
		return(
			<div className="timing">
				<div className="wrapper timing__layout">
					<Dayline />
				</div>
			</div>
		)
	}
}