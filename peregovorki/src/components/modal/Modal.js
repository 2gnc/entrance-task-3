import React, { Component } from 'react';

export default class Modal extends Component { //TODO проверить верстку кнопок (нет отступов)
	render() {
		let errorMsg = this.props.message.join( ', ' );
		
		 if (this.props.type === 'error') {
		 	return (
		 		<div className = 'modal'>
		 			<div className = 'modal__msg'>
		 				<div className = 'modal__row modal__row--icon'><img src='http://localhost:3000/img/emoji1.svg'/></div>
		 				<div className = 'modal__row modal__row--info'>
						  <div className = 'caption'>Обнаружены ошибки:</div>
							<div className = 'modal__errors'>{errorMsg}</div>
		 				</div>
		 				<div className = 'modal__row modal__row--btn'>
						  <a href='/' className = 'btn--link'>
							  <div className = 'btn btn--grey'>Отменить</div>
						  </a>
		 					<div className = 'btn' onClick={ this.props.fixHandler }>Исправить</div>
		 				</div>
		 			</div>
		 		</div>
		 	);
		 } else if (this.props.type === 'ok' ) {
		 	return (
		 		null
		 	);
		 } else if ( this.props.type === 'warning' ) {
		 	return (
				null
		 	);
		 } else {
		 	return null;
		}
	}
}
