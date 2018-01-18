import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';

moment.locale('ru');
moment.updateLocale('ru', {
	monthsShort : [
		"Янв", "Фев", "Мар", "Апр", "Май", "Июн",
		"Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
	]
});

export default class Datepick extends Component {
  constructor (props) {
    super(props);
    
    this.state = {
      startDate: this.props.daySelected
    };
    
    this.handleChange = this.handleChange.bind(this);
	
  }
	
  handleChange(date) {

	  this.setState ( {
		  startDate: date
	  } );
	
	  this.props.parent.setState ( {
		  currentDate: date
	  } );
	  
	  this.props.parent.dateHandler(date);

  }
  
  render() {
	  
    return <DatePicker
        selected = {this.state.startDate}
        onChange = {this.handleChange}
        dateFormat="DD MMM"
        id="datetoday"
        className="timing__input"
    />;
  }
}
