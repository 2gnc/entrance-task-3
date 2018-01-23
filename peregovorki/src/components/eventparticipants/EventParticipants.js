import React, { Component } from 'react';
import User from '../user/User';
import $ from 'jquery';

export default class EventParticipants extends Component {
	constructor ( props ) {
		super( props );
		this.state = {
			users: this.props.users.selectedUsers,
		};
	}
	
	componentDidMount() {
		let setDeleteHandler = () => {
			$('.event__participants').on( 'click', '*[data-type="remove"]', (event)=>{
				let papa = $(event.target.parentNode);
				let name = papa.find('.user__name').text();
				let x;
				this.state.users.map((item, i)=> {
					if(item.login === name) { x = i } return null;
				});
				this.props.parent.handleRemoveUser( name );
				this.forceUpdate();
			});
		};
		setTimeout( setDeleteHandler, 500 );
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

