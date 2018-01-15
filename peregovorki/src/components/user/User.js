import React, { Component } from 'react';

export default class User extends Component {
	
	render () {
		if(this.props.renderType === "--listed") {
			return(
				<div className={"user user" + this.props.renderType}>
					<img className="user__pic" src={this.props.avatarurl}/>
					<div className="user__name">{this.props.login}</div>
					<div className="user__desc">&middot; {this.props.floor}</div>
				</div>
			)
		} else if( this.props.renderType === "--in-event" ) {
			return (
				<div className = {"user user" + this.props.renderType }>
					<img className = "user__pic" src={this.props.avatarurl} />
					<div className = "user__name user__name--in-event">{this.props.login}</div>
					<div className="icon icon--close" onClick={this.props.deletehandler} ></div>
				</div>
			)
		} else {
			return (
				null
			)
		}
		
	}
}