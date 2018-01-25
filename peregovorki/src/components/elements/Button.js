import React, { Component } from 'react';

export default class Button extends Component {

	render() {
		return (
			<button className={`btn ${ this.props.modificator }`} onClick={this.props.clickHandler} disabled = {this.props.isDisabled} >{this.props.command}</button>
		)
	}
}