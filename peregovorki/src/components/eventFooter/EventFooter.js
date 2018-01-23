import React, { Component } from 'react';
import Button from '../elements/Button';
import {Link} from 'react-router';

export default class EventFooter extends Component {
	render() {
		// команды
		let saveHandler = this.props.saveHandler;
		let deleteHandler = this.props.deleteHandler;

		let buttons = [];
		let modifier;
		
		if (this.props.mode === 'new' || this.props.mode ===  'make/:data' ) {
			buttons.push( <Link to='/' key = '1'><Button modificator = 'btn--grey' command = 'Отмена' /></Link> );
			buttons.push( <Button modificator = '' command = 'Создать встречу' key = '2' clickHandler={saveHandler} /> );
			modifier = 'event__buttons event__buttons--desktop event__buttons--two';
		} else if ( this.props.mode === 'event' ) {
			buttons.push( <Link to = '/' key = '1'><Button modificator = 'btn--grey' command = 'Отмена' /></Link>);
			buttons.push( <Button modificator = 'btn--grey' command = 'Удалить встречу' key = '3' clickHandler={deleteHandler} />);
			buttons.push( <Button modificator = '' command = 'Сохранить' key = '2' /> );
			modifier = 'event__buttons event__buttons--three event__buttons--desktop';
		} else {
			return null
		}
		if (this.props.mode === 'new' || this.props.mode ===  'make/:data' || this.props.mode === 'event' ) {
			return (
				<div className = 'event__footer' >
					<div className={ modifier }>
						{buttons}
					</div>
				</div>
			)
		} else {
			return (
				null
			)
		}
	}
}