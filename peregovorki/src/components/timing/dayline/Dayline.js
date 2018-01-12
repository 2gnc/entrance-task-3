import React, { Component } from 'react';
import Icon from './../../elements/Icon';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import Datepick from './../../elements/Datepick';

/* сегодня */
let today = moment();


export default class Dayline extends Component {
	render() {
		return(
			<div className="timing__dayline">
				<div className="timing__day-to-display">
					<Icon modificator="icon--arrl" />
					<div className="timing__date">
						<Datepick className='red-border' />
						{/*тут выводить label или нет*/}
						<label className="timing__label" htmlFor="datetoday">Сегодня</label>
					</div>
					<Icon modificator="icon--arrr" />
				</div>
			</div>
		)
	}
}