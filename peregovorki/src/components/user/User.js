import React, { Component } from 'react';

export default class User extends Component {
	
	// пропсы
	// ID
	// avatarurl
	// login
	// floor
	// renderType (--in-event --listed)
	
	render () {
		return(
			<div className={"user " + this.props.renderType}>
				<img className="user__pic" src={this.props.avatar}/>
				<div className="user__name">{this.props.login}</div>
				<div className="user__desc">&middot; {this.props.floor}</div>
			</div>
		)
	}
}