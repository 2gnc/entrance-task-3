import React, { Component } from 'react';
import Button from './../elements/Button';

export default class Header extends Component {
	render(){
		return (
			<header className="header">
				<div className="wrapper header__layout">
					<a className="logo__link" href="/">
						<img className="logo" src="img/logo.svg" alt="Яндекс переговорки"/>
					</a>
					<Button modificator="btn--nomob" command="Создать встречу" />
				</div>
			</header>);
		}
	};