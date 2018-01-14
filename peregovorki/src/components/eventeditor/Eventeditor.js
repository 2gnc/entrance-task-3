import React, { Component } from 'react';
import Header from '../header/Header'
import IconClose from "../elements/IconClose";
import Autocomplete from 'react-autocomplete';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import User from '../user/User';
import EventParticipants from '../eventparticipants/EventParticipants';

class Eventeditor extends Component {
	// при выборе в автокомплите обновлять состояние, добавлять юзеров в массив
	
	constructor(props) {
		super (props);
		this.state={
			selectedUsers: [],
			value: ''
		};
		this.addUserHandler = this.addUserHandler.bind(this);
	}
	
	addUserHandler(choice) {
		this.setState(
			this.state.selectedUsers.push(choice)
		);
	}
	
	render () {
		if(!this.props.data.users) {
			return null;
		}
		
		console.log( "ss", this.props.data.users);
		
		// обработка users
		
		let hasButton = false;
		let eventmode = this.props.routeParams.eventid; // new или id(num)
		let heading;
		if (eventmode === "new") {
			heading = "Новая встреча"
		} else {
			heading = "Редактирование встречи"
		}
		return (
			<div className="App__wrapper">
				<Header hasButton = {hasButton} />
				<form className="event" method="GET" action="#">
					<div className="event__wrapper">
						<div className="event__heading">
							<div className="caption">{heading}</div>
							<IconClose/>
						</div>
						<div className="event__row">
							<div className="event__col">
								<label className="label" htmlFor="eventTheme">Тема</label>
								<input
									className="inpt event__text-inpt"
									type="text" id="eventTheme"
									placeholder="О чем будете говорить?"
									/>
							</div>
							<div className="event__col">
								<div className="date-time-inpt">
									<div className="date-time-inpt__date">
										<label className="label label--desktop" htmlFor="eventDate">Дата</label>
										<label className="label label--touch" htmlFor="eventDate">Дата и время</label>
										<input className="inpt date-time-inpt__date-inpt"
											   type="text"
											   
											   id="eventDate"/>
									</div>
									<div className="date-time-inpt__times">
										<div className="date-time-inpt__time">
											<div className="label label--desktop">Начало</div>
											<input className="inpt date-time-inpt__time-inpt"
												   type="text"
												   
												   pattern="[0-9]{2}:[0-9]{2}"
												   placeholder="чч:мм"/>
										</div>
										<div className="date-time-inpt__separator">&ndash;</div>
										<div className="date-time-inpt__time">
											<div className="label label--desktop">Конец</div>
											<input className="inpt date-time-inpt__time-inpt"
												   type="text"
												   
												   pattern="[0-9]{2}:[0-9]{2}"
												   placeholder="чч:мм"/>
										</div>
									</div>
								</div>
							</div>
							<div className="event__separator"></div>
						</div>
						<div className="event__row">
							<div className="event__col">
								<label className="label" htmlFor="eventUsersInpt">Участники</label>
								<Autocomplete
									getItemValue={(item) => item.label}
									items={[
										
										{ label: 'apple' },
										{ label: 'banana' },
										{ label: 'pear' }
									]}
									renderItem={(item, isHighlighted) =>
										<div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
											{item.label}
										</div>
									}
									value={this.state.value}
									onSelect = {(value) => {console.log(value)} }

								/>
								<EventParticipants users={this.state.selectedUsers} />
							</div>
							<div className="event__separator"></div>
						</div>
					</div>
				</form>
			</div>
			
		)
	}
}
export default graphql(gql`query {users {id login homeFloor avatarUrl }}`, {})(Eventeditor);