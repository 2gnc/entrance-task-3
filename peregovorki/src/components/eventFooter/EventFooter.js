import React, { Component } from 'react';
import Button from "../elements/Button";

export default class EventFooter extends Component {
	render() {
		let buttons = [];
		let modifier;
		if (this.props.mode === "new") {
			buttons.push( <Button modificator = "btn--grey" command="Отмена" key = "1" /> ); /* ссылка на Главную */
			buttons.push( <Button modificator = "" command="Создать встречу" key = "2" /> ); /* хэндлер из родительского компонента */
			modifier = "event__buttons--two";
		}
		return(
			<div className="event__footer">
				<div className={"event__buttons event__buttons--desktop " + {modifier} }>
					{buttons}
				</div>
			</div>
		)
	}
}