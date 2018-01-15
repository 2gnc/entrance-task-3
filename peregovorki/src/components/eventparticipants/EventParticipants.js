import React, { Component } from 'react';
import User from '../user/User';
import $ from 'jquery';

export default class EventParticipants extends Component {
	constructor ( props ) {
		super( props );
		this.state = {
			users: this.props.users.selectedUsers,
			test: ''
		};
	}
	
	componentDidMount() {
		$('.event__participants').on( 'click', '*[data-type="remove"]', (event)=>{
			let papa = $(event.target.parentNode);
			let name = papa.find('.user__name').text();
			console.log( name );
			this.setState({test: name});
			this.state.users = this.state.users.map((item)=> {
				return item
			});
			console.log(this.state);
		} )
	}
	
	componentDidUpdate() {
		console.log($('*[data-type="remove"]'));
	}
	
	render() {
		let users = this.props.users.selectedUsers;
		let usersToDisplay = users.map(
			(item, i) => {
				return (
					<User
						id={+item.id}
						avatarurl={item.avatarUrl}
						login={item.login}
						floor={item.homeFloor}
						renderType="--in-event"
						key={i}
					/>
				)
			}
		);
		return (
			<div className="event__participants">
				{usersToDisplay}
			</div>
		)
	}
}

