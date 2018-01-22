import React, { Component } from 'react';
import Header from '../header/Header';
import IconClose from '../elements/IconClose';
import Autocomplete from 'react-autocomplete';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import EventParticipants from '../eventparticipants/EventParticipants';
import EventRecomendations from '../eventRecomendations/EventRecomendations';
import EventFooter from '../eventFooter/EventFooter';
import Modal from '../modal/Modal';
import $ from 'jquery';

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
			eventDate: moment(),
			dateToChange: '',
			showModal: '',
		};
		
		this.timer = null;
		this.errors = '';
		this.roomInfo = '';
		
		this.fakeRequest = this.fakeRequest.bind( this );
		this.matchStateToTerm = this.matchStateToTerm.bind( this );
		this.selectedRoomUpd = this.selectedRoomUpd.bind( this );
		this.handleDateChange = this.handleDateChange.bind( this );
		this.eventDelete = this.eventDelete.bind( this );
		this.handleAddUser = this.handleAddUser.bind( this );
		this.handleRemoveUser = this.handleRemoveUser.bind( this );
		this.saveEvent = this.saveEvent.bind( this );
		this.validation = this.validation.bind( this );
		this.fixErrors = this.fixErrors.bind( this );
		this.eventLoader = this.eventLoader.bind( this );
		this.eventShow = this.eventShow.bind( this );
	}
	componentDidUpdate() {
		
		if ( this.props.eventToDownload ) {
			this.eventShow( this.eventLoader() );
		}
	}
/**
 * Function eventLoader Загружает и обрабатывает данные о событии. Возвращает объект с данными о событии.
 * @returns {object}
 */
	eventLoader() {
		if(this.props.eventToDownload && this.props.data ) {
			let obj = {};
			let usersIds = this.props.data.event.users.map( (item) => {
				return item.id;
			});


			obj.theme = this.props.data.event.title;
			obj.participants = this.props.data.users.map( (item) => {
				let x;
				for ( let i = 0; i < usersIds.length; i ++ ) {
					if( usersIds[i] === item.id ) { x = item }
				}
				if ( x ) { return x } else {return}
			}).filter( (val) => {
				return val;
			});
			obj.dateMoment = this.props.data.event.dateStart;
			obj.date = moment( this.props.data.event.dateStart ).format( 'DD MMMM, YYYY' );
			obj.startTime = moment( this.props.data.event.dateStart ).utc().format( 'hh:mm' ); // TODO сюда преобразованное время
			obj.endTime = moment( this.props.data.event.dateEnd ).utc().format( 'hh:mm' ); // TODO сюда преобразованное время
			obj.room = String( this.props.data.event.room.id );
			return obj;
			} else {
			return null;
		}
	}
	
	/**
	 * Function eventShow Отображает загруженную информацию о событии
	 * @param {object} eventObj Результат выполнения eventLoader()
	 */
	eventShow() { //TODO вынести переменные инпутов в конструктор
		if (this.props.eventToDownload && this.props.data.event ) {
			let eventData = this.eventLoader();
			console.log( 'eventShow starts', eventData );
			let themeInpt = $( '#eventTheme' );
			let DateInpt = $( '#eventDate' );
			let timeStartInpt = $( '#timeStart' );
			let timeEndInpt = $( '#timeEnd' );
			
			themeInpt.val( eventData.theme );
			if( !DateInpt.val() ) { DateInpt.val( eventData.date ) }
		}
	}
/**
 * Function fixErrors обрабатывает сценарий "справление ошибок формы". Убирает красную рамку с ошибочных полей при фокусе.
 */
	fixErrors() {
		this.setState({
			showModal: '',
		});
		let removeBorder = (e) => {
			if ( $(e.target).hasClass('inpt--error') ) {
				$(e.target).toggleClass( 'inpt--error' );
			}
		};
		$( '#eventTheme' ).on('focus', removeBorder);
		$( '#eventUsersInpt' ).on('focus', removeBorder);
		$( '#eventDate' ).on('focus', removeBorder);
		$( '#timeStart' ).on('focus', removeBorder);
		$( '#timeEnd' ).on('focus', removeBorder);
	}
/**
 * Function validation проверяет поля формы и возвращает или найденные ошибки или параметры события
 * @returns {array||object}
 */
	validation() { //TODO добавить уловия проверки для редактирования события
		
		let errors = [];
		let theme = $( '#eventTheme' );
		let users = $( '#eventUsersInpt' );
		let date = $( '#eventDate' );
		let startInpt = $( '#timeStart' );
		let startTime = this.state.eventDate.format('YYYY-MM-DD') + 'T' + startInpt.val();
		let endInpt = $( '#timeEnd' );
		let endTime = this.state.eventDate.format('YYYY-MM-DD') + 'T' + endInpt.val();
		
		this.errors = []; // сбрасываем ошибки, если валидация запусткается повторно
		this.eventInfo = '';
		
		if ( theme.val() < 3 ) {// тема сообщения указана
			errors.push( 'непонятная тема' );
			if( !theme.hasClass('inpt--error') ) {theme.addClass( 'inpt--error' );}
		}
		if ( this.state.selectedUsers.length < 1 ) { // выбран хотя бы 1 пользователь
			errors.push( 'мало участников' );
			if( !users.hasClass('inpt--error') ) {users.addClass( 'inpt--error' );}
		}
		if ( this.props.parent.props.routeParams.eventid === 'new' &&  this.state.eventDate.isBefore( moment(), 'day' ) ) { // дата в прошлом (для новых событий)
			errors.push( 'дата события в прошлом' );
			if( !date.hasClass('inpt--error') ) {date.addClass( 'inpt--error' );}
		}
		if ( !moment(startTime).isBefore( endTime, 'minute' ) ) { // время окончания позже времени начала //TODO проверять время в прошлом
			errors.push( 'неверно указано время' ); //TODO проверять дилтельнось события не короче 5 минут
			if( !startInpt.hasClass('inpt--error') ) {startInpt.addClass( 'inpt--error' );}
			if( !endInpt.hasClass('inpt--error') ) {endInpt.addClass( 'inpt--error' );}
		}
		if ( !this.state.selectedRoom ) { // переговорка выбрана
			errors.push( 'не выбрана переговорка' );
		}
		
		//возвращаем результат проверки
		if ( errors.length > 0 ) {
			this.errors = errors;
			return errors;
		} else {
			return (
				{
					eventTheme: theme.val(),
					eventParticipants: this.state.selectedUsers.map( (item, i) => {
						return item.id;
					}),
					eventRoom: this.state.selectedRoom,
					eventStart: moment( startTime ).utc('981Z'),
					eventEnd: moment( endTime ).utc('981Z'),
				}
			);
		}
	}
/**
* Function saveEvent Запускает валидацию и сохраняет событие в БД
* @parpam {object} e Событие клика на кнопку "Сохранить"
*/
	saveEvent(e) { // TODO будет использоваться как для новых событий так и при редактировании
		e.preventDefault();
		
		if ( this.props.parent.props.routeParams.eventid === 'new' || this.props.parent.props.route.path ===  'make/:data' ) { // если сохраняем новое событие
/**
 * @const parameters Набор параметров события для сохранения в БД
 * @type {object} 
 */
			let parameters = this.validation();
			
			if( this.errors.length > 0 ) { // если ошибка валидации - показываем модальное окно с ошибкой
				this.setState({
					showModal: 'error',
				});
			} else { // все заполнено верно, запускаем мутацию craeteEvent (считатеся, что проверка занятости переговорок наъдится в recomendations, а занятость участников не проверяется)
				this.eventInfo = this.state.eventDate.format( 'DD MMMM YYYY' ) +
					', ' +
					$( '#timeStart' ).val() +
					' - ' +
					$( '#timeEnd' ).val() +
					' ' +
					this.roomInfo;
				
				this.setState({
					showModal: '',
				});
				
				this.props.mutate({
						mutation: 'craeteEvent',
						variables: {
							input: {
								title: parameters.eventTheme,
								dateStart: parameters.eventStart,
								dateEnd: parameters.eventEnd,
							},
							users: parameters.eventParticipants,
							room: parameters.eventRoom,
						}
					})
					.then(({ data }) => {
						this.setState({
							showModal: 'succes',
						});
					}).catch((error) => {
					console.log('there was an error sending the query create', error);
				});
			}
		} else {
			return null;
		}
	}

	eventDelete(){ //TODO заменить заглушки на переменные
		this.props.mutate({
				mutation: 'removeEvent',
				variables: {
					id: 81
				}
			})
			.then(({ data }) => {
				console.log('got data delete', data);
			}).catch((error) => {
			console.log('there was an error sending the query delete', error);
		});
	}

	handleAddUser( user ) { //TODO если это режим редактирования события - вызывать мутацию addUserToEvent
		if ( user ) {
			this.state.selectedUsers.push(user);
		}
	}

	handleRemoveUser( user ) { //TODO если это режим редактирования события - вызывать мутацию removeUserFromEvent

	}
	handleDateChange( date ) {
		this.setState({
			eventDate: date,
			dateToChange: date,
		});
		console.log('handleDateChange', date );
	}
	fakeRequest( value, cb ) {
		return setTimeout(cb, 500, value ?
			this.state.userlist.filter( state => this.matchStateToTerm(state, value) ) :
			this.props.data.users
		);
	}
	matchStateToTerm(state, value) {
		return (
			state.login.toLowerCase().indexOf(value.toLowerCase()) !== -1
		);
	}
	selectedRoomUpd( roomId, roomName, roomFloor ) {
		if( roomId && roomName && roomFloor ) {
			this.setState({
				selectedRoom: roomId,
			});
			this.roomInfo = roomName + ' · ' + roomFloor + ' этаж';
		}
	}
	render () {
		console.log(this.props, this.state);
		console.log( 'this.props.data.event', this.props.data.event );
		
		
/**
 * Ожидаем загрузку пользователей
 */
		if(!this.props.data.users) {
			return null;
		}

		// if(!this.props.data.event) {
		// 	return null;
		// }
		setTimeout( () => { console.log( this.eventLoader() )}, 1000);
		
		if(!this.state.userlist) {
			this.state.userlist = this.props.data.users;
		}
/**
 * Function showModal отпределяет, нужно ли показывать модальное окно и если нужно, то какое именно.
 * @returns Компонент <Modal /> с параметрами.
 */
		let showModal = () => {
			if( this.state.showModal === 'error' ) {
				return ( <Modal message = {this.errors} type = "error" fixHandler = {this.fixErrors} />);
			} else if ( this.state.showModal === 'succes' ) {
				return ( <Modal message = 'Встреча создана!' type = 'succes' eventInfo = {this.eventInfo} /> );
			} else {
				return null
			}
		};
/**
 * Function dateForInput определяет, какую дату поставить в датапикер.
 * @returns {*|moment.Moment}
 */
		let dateForInput = () => {
			console.log( 'режим', this.props.parent.props.route.path, this.state );
			if (this.props.parent.props.routeParams.eventid === 'new') {
				return this.state.eventDate;
			} else if ( this.props.parent.props.route.path === 'event' ) { //TODO уточнить тут
				let obj = this.eventLoader();
				let dateOfEvent = moment(obj.dateMoment);
				if ( !this.state.dateToChange ) {
					console.log( 'dateForInput', dateOfEvent );
					return dateOfEvent
				} else {
					console.log( 'dateForInput', this.state.dateToChange );
					return this.state.dateToChange ;
				}
			} else if ( this.props.parent.props.route.path === 'make/:data' ) {
				if ( this.props.parent.props.routeParams.data && !this.state.dateToChange ) {
					let mask = /^\d{8}/;
					let date = mask.exec( this.props.parent.props.routeParams.data )[0];
					return moment(date);
				} else {
					return this.state.dateToChange ;
				}
			} else {
				return null ;
			}
			
		};
/*
 * @const eventmode Режим открытия страницы редактирования. Может быть "new" или "make/:data", добавить режим просмотра существующего
 * @type {string} 
 */
		const eventmode = (this.props.parent.props.routeParams.eventid || this.props.parent.props.route.path);
/**
 * Function getHeading определяет, какой выводить заголовок.
 * @returns {string} Строка заголовка.
 */
		let getHeading = () => {
			if ( eventmode === 'new' || /(\W|^)make(\W|$)/.exec( this.props.parent.props.route.path ) ) {
				return 'Новая встреча';
			} else {
				return 'Редактирование встречи';
			}
		};
/**
 * Function getStartEndTimes определяет время начала и конца для новых событий, созданных из плюсика. Берет все символы после второго символа тире.
 * @returns {string} Строка заголовка.
 */
		let getStartEndTimes = () => {
			if ( this.props.parent.props.routeParams.data ) {
				const str = this.props.parent.props.routeParams.data;
				let timeslot = str.substr( str.lastIndexOf('-') + 1 );
				let StartEndTimes = {};
				StartEndTimes.start = timeslot + ':00';
				StartEndTimes.end = (+timeslot + 1) + ':00'
				if (timeslot) {return StartEndTimes} else {return null } ;
			} else { // добавить чтение из события если режим события
				return null;
			}
			
		}
/**
 * Function startTime возвращает строку для подстановки в инпут "время начала"
 * @returns {string}
 */
		let startTime = () => {
			if( getStartEndTimes() ){ // 
				return getStartEndTimes().start;
			} else {
				return '';
			};
		};
/**
 * Function endTime возвращает строку для подстановки в инпут "время окончания"
 * @returns {string}
 */
		let endTime = () => {
			if( getStartEndTimes() ){
				return getStartEndTimes().end;
			} else {
				return '';
			};
		};

		let target;

		return (
			<div className='App__wrapper'>
				<Header hasButton = {false} />
				<form className='event' method='GET' action='#'>
					<div className='event__wrapper'>
						<div className='event__heading'>
							<div className='caption'>{getHeading()}</div>
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
										<DatePicker
											selected = { dateForInput() }
											onChange = {this.handleDateChange}
											dateFormat="DD MMMM, YYYY"
											id="eventDate"
											className="inpt date-time-inpt__date-inpt"
											readOnly={true}
										/>
									</div>
									<div className='date-time-inpt__times'>
										<div className='date-time-inpt__time'>
											<div className='label label--desktop'>Начало</div>
											<input className='inpt date-time-inpt__time-inpt'
											     id="timeStart"
												   type='text'
												   pattern='[0-9]{2}:[0-9]{2}'
												   placeholder='чч:мм'
												   defaultValue = { startTime() }
												   />
										</div>
										<div className='date-time-inpt__separator'>&ndash;</div>
										<div className='date-time-inpt__time'>
											<div className='label label--desktop'>Конец</div>
											<input className='inpt date-time-inpt__time-inpt'
												id="timeEnd"
												type='text'
												pattern='[0-9]{2}:[0-9]{2}'
												placeholder='чч:мм'
												defaultValue = { endTime() } />
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
										if ( this.state.selectedUsers.indexOf( target ) === -1 ) {
											this.handleAddUser( target );
										}
										this.forceUpdate();
									}}
								/>
								<EventParticipants users = {this.state} parent = {this} />
							</div>
							<div className='event__separator'></div>
							<EventRecomendations parent = {this} selectedRoom = {this.state.selectedRoom} />
						</div>
					</div>
					<div className='event__new-event-controls'>
						<div className='event__msg'>Выберите переговорку</div>
						<div className='event__buttons event__buttons--newevent'>
							<button className='btn btn--grey' disabled='disabled'>Создать встречу</button>
							<button className='btn btn--grey'>Отмена</button>
						</div>
					</div>
					<EventFooter mode={eventmode} saveHandler = {this.saveEvent} />
				</form>
				{showModal()}
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
	};
}



const queryAll = gql ` query ($id: ID!) {
 users {id login homeFloor avatarUrl }

  event (id: $id) {
    title
    dateStart
    dateEnd
    users {
      id
    }
    room {
      id
    }
  }
} `;



export default compose(

	graphql( queryAll, {options: ({eventToDownload}) => ({ variables: {id: eventToDownload,}, }), } ),
	graphql(gql` mutation removeEvent ( $id: ID!) { removeEvent (id: $id) { id } }`, {}),
	graphql(gql`
		mutation craeteEvent ($input: EventInput!, $users: [ID], $room: ID!) {
			createEvent( input: $input, User:$users, Room:$room ) {
				title
				dateStart
				dateEnd
				users {
					id
				}
				room {
					id
				}
			}
		}
	`, {})

)(Eventeditor);
