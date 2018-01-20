import React, { Component } from 'react';
import Header from '../header/Header'
import IconClose from '../elements/IconClose';
import Autocomplete from 'react-autocomplete';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import EventParticipants from '../eventparticipants/EventParticipants';
import EventRecomendations from '../eventRecomendations/EventRecomendations';
import EventFooter from '../eventFooter/EventFooter';

import {Link} from 'react-router';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';

moment.locale('ru');
moment.updateLocale('ru', {
	monthsShort : [
		"Янв", "Фев", "Мар", "Апр", "Май", "Июн",
		"Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
	]
});

class Eventeditor extends Component {
	constructor(props) {
		super (props);
		this.state = {
			selectedUsers: [],
			value: '',
			userlist: null,
			loading: false,
			selectedRoom: '',
		};
		
		this.timer = null;
		this.fakeRequest = this.fakeRequest.bind(this);
		this.matchStateToTerm = this.matchStateToTerm.bind(this);
		this.selectedRoomUpd = this.selectedRoomUpd.bind(this);
	}

	fakeRequest(value, cb) {
		return setTimeout(cb, 500, value ?
			this.state.userlist.filter(state => this.matchStateToTerm(state, value)) :
			this.props.data.users
		);
	}
	matchStateToTerm(state, value) {
		return (
			state.login.toLowerCase().indexOf(value.toLowerCase()) !== -1
		);
	}
	selectedRoomUpd( roomId ) {
		if(roomId) {
			this.setState({
				selectedRoom: roomId,
			});
		}
	}
	render () {
		console.log(this.props);
		if(!this.props.data.users) {
			return null;
		}
		if(!this.state.userlist) {
			this.state.userlist = this.props.data.users;
		}
		let hasButton = false;
		let eventmode = this.props.routeParams.eventid;
		let heading;
		if (eventmode === 'new') {
			heading = 'Новая встреча';
		} else {
			heading = 'Редактирование встречи';
		}
		let target;
		return (
			<div className='App__wrapper'>
				<Header hasButton = {hasButton} />
				<form className='event' method='GET' action='#'>
					<div className='event__wrapper'>
						<div className='event__heading'>
							<div className='caption'>{heading}</div>
							<a href="/"><IconClose/></a>
						</div>
						<div className='event__row'>
							<div className='event__col'>
								<label className='label' htmlFor='eventTheme'>Тема</label>
								<input
									className='inpt event__text-inpt'
									type='text' id='eventTheme'
									placeholder='О чем будете говорить?'
									/>
							</div>
							<div className='event__col'>
								<div className='date-time-inpt'>
									<div className='date-time-inpt__date'>
										<label className='label label--desktop' htmlFor='eventDate'>Дата</label>
										<label className='label label--touch' htmlFor='eventDate'>Дата и время</label>
										<input className='inpt date-time-inpt__date-inpt'
											   type='text'
											   id='eventDate'/>
									</div>
									<div className='date-time-inpt__times'>
										<div className='date-time-inpt__time'>
											<div className='label label--desktop'>Начало</div>
											<input className='inpt date-time-inpt__time-inpt'
												   type='text'
												   pattern='[0-9]{2}:[0-9]{2}'
												   placeholder='чч:мм'/>
										</div>
										<div className='date-time-inpt__separator'>&ndash;</div>
										<div className='date-time-inpt__time'>
											<div className='label label--desktop'>Конец</div>
											<input className='inpt date-time-inpt__time-inpt'
												   type='text'
												   pattern='[0-9]{2}:[0-9]{2}'
												   placeholder='чч:мм'/>
										</div>
									</div>
								</div>
							</div>
							<div className='event__separator'></div>
						</div>
						<div className='event__row'>
							<div className='event__col'>
								<label className='label' htmlFor='eventUsersInpt'>Участники</label>
								<Autocomplete
									inputProps={{	id: 'eventUsersInpt',
										className: 'inpt event__text-inpt',
										placeholder: 'Например, Тор Одинович'
									}}
									wrapperStyle = {{}}
									getItemValue={(item) => item.login}
									items={this.state.userlist}
									renderItem={(item, highlighted) =>
										<div key={item.id} className={'user user--listed'} style={{ backgroundColor: highlighted ? ' #F6F7F9' : 'transparent'}}>
											<img className='user__pic' src={item.avatarUrl} alt={item.login + ' avatar'}/>
											<div className='user__name'>{item.login}</div>
											<div className='user__desc'>&middot; {item.homeFloor} этаж</div>
										</div>
									}
									renderMenu={(items, value, style) => (
											<div className='autocomplete__box'>
												<div className='autocomplete' >
													{value === '' ? (
														<div className='autocomplete__wrapper' children={items}></div>
													) : this.state.loading ? (
														<div className='item'>загружается...</div>
													) : items.length === 0 ? (
														<div className='item'>No matches for {value}</div>
													) : <div className='autocomplete__wrapper' children={items}></div>
													
													}
												</div>
											</div>
									)}
									value={this.state.value}
									onChange = {(e, value) => {
											this.setState({
												value,
												loading: true,
												userlist: []
											});
										clearTimeout(this.timer);
										this.timer = this.fakeRequest(value, (items) => {this.setState({ userlist: items, loading: false })})}
									}
									onSelect={(value) => {
										let usrname = value;
										
										this.state.userlist.forEach((item) => {
											if (item.login === usrname ) {target=item}
										});
										if( this.state.selectedUsers.indexOf(target) === -1 ) {this.state.selectedUsers.push(target)}
										this.forceUpdate();
									}}
								/>
								<EventParticipants users={this.state} />
							</div>
							<div className='event__separator'></div>
							<EventRecomendations parent={this} selectedRoom={this.state.selectedRoom} />
						</div>
					</div>
					<div className='event__new-event-controls'>
						<div className='event__msg'>Выберите переговорку</div>
						<div className='event__buttons event__buttons--newevent'>
							<button className='btn btn--grey' disabled='disabled'>Создать встречу</button>
							<button className='btn btn--grey'>Отмена</button>
						</div>
					</div>
					<EventFooter mode={eventmode} />
				</form>
			</div>
			
		)
	}
	renderItems(items) {
		return items.map((item, index) => {
			const text = item.props.children;
			if (index === 0 || items[index - 1].props.children.charAt(0) !== text.charAt(0)) {
				return [<div className='item item-header'>{text.charAt(0)}</div>, item]
			}
			else {
				return item
			}
		})
	}
}
export default graphql(gql`query {users {id login homeFloor avatarUrl }}`, {})(Eventeditor);