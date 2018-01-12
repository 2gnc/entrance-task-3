import React, { Component } from 'react';

export default class Header extends Component {
	render(){
		return (
			<header className="header">
				<div className="wrapper header__layout">
					<a className="logo__link" href="/">
						<img className="logo" src="img/logo.svg" alt="Яндекс переговорки"/>
					</a>
				</div>
			</header>);
		}
	};