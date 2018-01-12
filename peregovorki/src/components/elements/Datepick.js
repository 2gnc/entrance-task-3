import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import russian from 'moment/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';

/* русская локализация */
moment.locale('ru');

export default class Datepick extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
 
  render() {
    return <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
        dateFormat="DD MMM"
        id="datetoday"
        className="timing__input"
    />;
  }
}