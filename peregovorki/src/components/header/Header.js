import React, { Component } from 'react';
import Button from './../elements/Button';
import {Link} from 'react-router'

export default class Header extends Component {
	
	render(){
		let button;
		
		if(this.props.hasButton === true) {
			button = <Link to="/test"><Button modificator="btn--nomob" command="Создать встречу" /></Link>
		} else {
			button = '';
		}
		
		console.log( "App перерисовал header" )
		
		return (
			<header className="header">
				<div className="wrapper header__layout">
					<a className="logo__link" href="/">
						<img className="logo" src="img/logo.svg" alt="Яндекс переговорки"/>
					</a>
					{button}
					
				</div>
			</header>);
		}
	};