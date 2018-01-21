import React, { Component } from 'react';
import Button from "../elements/Button";

export default class EventFooter extends Component {
	render() {
		// команды
		let saveHandler = this.props.saveHandler;
		
		let buttons = [];
		let modifier;
		
		if (this.props.mode === "new") {
			buttons.push(  <a href='/' className = 'btn--link' key = "1"><Button modificator = "btn--grey" command="Отмена"  /></a> );
			buttons.push( <Button modificator = "" command="Создать встречу" key = "2" clickHandler={saveHandler} /> );
			modifier = "event__buttons event__buttons--desktop event__buttons--two";
		}
		return(
			<div className="event__footer">
				<div className={ modifier }>
					{buttons}
				</div>
			</div>
		)
	}
}