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
		
		this.timer = null;
		this.errors = '';
		this.roomInfo = '';
		this.eventmode = (this.props.parent.props.routeParams.eventid || this.props.parent.props.route.path);
		this.initialEventUsers = [];
		this.initialEventRoom = '';
		this.initialEventInfo = '';
		this.eventInfo = '';
		
		this.fakeRequest = this.fakeRequest.bind( this );
		this.matchStateToTerm = this.matchStateToTerm.bind( this );
		this.selectedRoomUpd = this.selectedRoomUpd.bind( this );
		this.handleAddUser = this.handleAddUser.bind( this );
		this.handleRemoveUser = this.handleRemoveUser.bind( this );
		this.saveEvent = this.saveEvent.bind( this );
		this.deleteEvent = this.deleteEvent.bind( this );
		this.validation = this.validation.bind( this );
		this.fixErrors = this.fixErrors.bind( this );
		this.eventLoader = this.eventLoader.bind( this );
		this.eventShow = this.eventShow.bind( this );
		this.changer = this.changer.bind( this );
		this.getRecomendation = this.getRecomendation.bind( this );
		this.deleteDelete = this.deleteDelete.bind( this );
		this.changerTest = this.changerTest.bind( this );
		this.butterflyEffect = this.butterflyEffect.bind( this );

		this.state = {
			selectedUsers: [],
			value: '',
			userlist: null,
			loading: false,
			selectedRoom: '',
			neweventDate: null,
			showModal: '',
			recomendations: [],
			dateInPicker: moment(),
		};
	}

	componentDidMount() {
		setTimeout( () => {
			let date = $ ( '#eventDate' );
			let startInpt = $ ( '#timeStart' );
			let endInpt = $ ( '#timeEnd' );
			
			date.on ( 'change', this.changer );
			startInpt.on ( 'change', this.changer );
			endInpt.on ( 'change', this.changer );

			if ( this.props.eventToDownload ) {
				this.eventShow( this.eventLoader() );
			}
			
		}, 500);

		setTimeout( () => {
			if ( this.eventmode === 'new' ) {
				this.setState({
					dateInPicker: moment(),
					userlist: this.props.data.users,
				})
			} else if ( this.eventmode === 'event' ) {
				this.setState({
					dateInPicker: moment( this.props.data.event.dateStart ).utc(),
					userlist: this.props.data.users,
				})
			} else if ( this.eventmode === 'make/:data' ) {
				this.setState({
					dateInPicker: moment( /^\d{8}/.exec( this.props.parent.props.routeParams.data )[0] ),
					userlist: this.props.data.users,
				})
			} else {
				return null;
			}
		}, 300);
		
/**
 * Вызываем получение рекомендации (в данном случае будет единственная комната, которую нужно будет отобразить)
 */
		setTimeout( () => {
			if (
					this.eventmode === 'event' &&
					this.butterflyEffect( this.props.data.event.dateStart ) &&
					this.state.recomendations.length === 0
			) {
				this.getRecomendation();
			}
		}, 300 );
		
	}
	
/**
 * Function isItPast определяет, является ли указанный момент времени в прошлом с точностью до минуты.
 * @param {String} datetime строка с датой и временем в формате YYYY-MM-DDTHH:mm:ss.000Z
 */
	butterflyEffect( datetime ) {
		if ( datetime ) {
			let effect = moment(moment(datetime).utc().format( 'YYYY-MM-DDTHH:mm' )).isBefore( moment(moment().format( 'YYYY-MM-DDTHH:mm' )), 'minute' )
			return effect;
		} else {
			return true;
		}
		
}

/**
 * Function changerTest обрабатывает изменения в datepicker-e
 * @param {*|moment()} dd выбранная дата 
 */
	changerTest( dd ) {
		console.log( 'changerTest', dd );
		if ( this.eventmode === 'new' ) {
			this.setState({
				dateInPicker: dd,
			});
		} else if ( this.eventmode === 'event' ) {
			this.setState({
				dateInPicker: dd,
			});
		} else if ( this.eventmode === 'make/:data' ) {
			this.setState({
				dateInPicker: dd,
			});
		} else {
			return null;
		}
		setTimeout( this.changer, 100 );
	}

/**
 * Function changer запускает получение рекомендаций
 */
	changer() {
	/**
	 * @typedef {Object} EventDate
	 * @property {String} start Timestamp начала встречи. "YYYY-MM-DDTHH:mm:ss.SSSSZ"
	 * @property {String} end Timestamp окончания встречи. "YYYY-MM-DDTHH:mm:ss.SSSSZ"
	 */
	let EventDate = {
		start: moment( $( '#eventDate' ).val() + ' ' + $( '#timeStart' ).val() ),
		end: '',
	};
	
	let members = [];
	
	this.getRecomendation( EventDate, members );
	console.log( 'changer', EventDate );
	
	}

	getRecomendation( date, members ) {
		let recomendations = [];
		
		console.log( 'getRecomendation', date );
		console.log( 'getRecomendation', members );
		
/**
 * @typedef {Object} Recommendation
 * @property {EventDate} date Дата и время проведения встречи.
 * @property {String} room Идентификатор переговорки.
 * @property {RoomsSwap[]} [swap] Необходимые замены переговорк для реализации рекомендации.
 */
		let Recomendation = {
			date: {},
			room: '',
			swap: [],
		};

/**
 * @typedef {Object} RoomsSwap
 * @property {string} event Идентификатор встречи.
 * @property {String} room Новый идентификатор переговорки.
 */
		let RoomsSwap = {
			event: '',
			room: '',
		};

		
		// если это режим event и событие в прошлом, отображаем только выбранную переговорку
		if ( this.eventmode === 'event' && this.butterflyEffect( this.props.data.event.dateStart ) ) {
			let date = {
				start: this.props.data.event.dateStart,
				end: this.props.data.event.dateEnd,
			};
			let singleRecomendation = {
				date: date,
				room: this.props.data.event.room,
				swap: [],
			};
			
			recomendations.push( singleRecomendation );
			
			this.setState({
				recomendations: recomendations,
			});
			
			console.log( 'рекомендации:', this.state.recomendations );
		}
		
		
		
		
		return recomendations;
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
				if ( x ) { return x } else {return null}
			}).filter( (val) => {
				return val;
			});
			obj.dateMoment = this.props.data.event.dateStart;
			obj.date = moment( this.props.data.event.dateStart ).utc().format( 'DD MMMM, YYYY' );
			obj.startTime = moment( this.props.data.event.dateStart ).utc().format( 'HH:mm' ); 
			obj.endTime = moment( this.props.data.event.dateEnd ).utc().format( 'HH:mm' ); 
			obj.room = String( this.props.data.event.room.id );
			return obj;
			} else {
			return null;
		}
	}
	
/**
 * Function eventShow Отображает загруженную информацию о событии из eventloader()
 * @param {object} loader результат функции loader()
 * @param {object} eventObj Результат выполнения eventLoader()
 */
	eventShow( loader ) {
		if ( this.props.eventToDownload && this.props.data.event ) {
			let themeInpt = $( '#eventTheme' );
			let DateInpt = $( '#eventDate' );
			let timeStartInpt = $( '#timeStart' );
			let timeEndInpt = $( '#timeEnd' );
			
			//заполняем тему события
			themeInpt.val( loader.theme );
			// заполняем дату
			if( !DateInpt.val() ) {
				DateInpt.val( loader.date);
			}
			// заполняем пользователей
			if ( this.state.selectedUsers.length === 0 ) {
				this.setState({
					selectedUsers: loader.participants,
				});
			}
			// заполняем время
			timeStartInpt.val( loader.startTime );
			timeEndInpt.val( loader.endTime );
			// записываем комнату
			if( loader.room ) {
				this.setState({
					selectedRoom: loader.room,
				});
			}
		}
	}
/**
 * Function fixErrors обрабатывает сценарий "справление ошибок формы". Убирает красную рамку с ошибочных полей при фокусе.
 */
	fixErrors() {
		let evTheme = $( '#eventTheme' );
		let evUsers = $( '#eventUsersInpt' );
		let evDate = $( '#eventDate' );
		let evStart = $( '#timeStart' );
		let evEnd = $( '#timeEnd' );
		
		this.setState({
			showModal: '',
		});
		
		let removeBorder = (e) => {
			if ( $(e.target).hasClass('inpt--error') ) {
				$(e.target).toggleClass( 'inpt--error' );
			}
		};
		
		let removedatetimeborder = (e) => {
			if ( evDate.hasClass('inpt--error') ) {
				evDate.toggleClass( 'inpt--error' );
			}
			if ( evStart.hasClass('inpt--error') ) {
				evStart.toggleClass( 'inpt--error' );
			}
			if ( evEnd.hasClass('inpt--error') ) {
				evEnd.toggleClass( 'inpt--error' );
			}
		};
		
		evTheme.on('focus', removeBorder);
		evUsers.on('focus', removeBorder);
		evDate.on('focus', removedatetimeborder);
		evStart.on('focus', removedatetimeborder);
		evEnd.on('focus', removedatetimeborder);
	}
/**
 * Function validation проверяет поля формы и возвращает или найденные ошибки или параметры события
 * @returns {array||object}
 */
	validation() {
		
		let errors = [];
		let theme = $( '#eventTheme' );
		let users = $( '#eventUsersInpt' );
		let date = $( '#eventDate' );
		let startInpt = $( '#timeStart' );
		let startTime = this.state.dateInPicker.format('YYYY-MM-DD') + 'T' + startInpt.val() + ':00.000Z';
		let endInpt = $( '#timeEnd' );
		let endTime = this.state.dateInPicker.format('YYYY-MM-DD') + 'T' + endInpt.val() + ':00.000Z';
	
		console.log( 'butterflyEffect', startTime, this.butterflyEffect( startTime ) );
		
		this.errors = []; // сбрасываем ошибки, если валидация запусткается повторно
		
		if ( theme.val() < 3 ) {// тема сообщения указана
			errors.push( 'непонятная тема' );
			if( !theme.hasClass('inpt--error') ) {theme.addClass( 'inpt--error' );}
		}
		if ( this.state.selectedUsers.length < 1 ) { // выбран хотя бы 1 пользователь
			errors.push( 'мало участников' );
			if( !users.hasClass('inpt--error') ) {users.addClass( 'inpt--error' );}
		}
		if ( this.butterflyEffect( startTime ) ) { // дата в прошлом для режима event с точностью до минуты
			errors.push( 'вы пытаетесь вмешаться в прошлое' );
			if( !date.hasClass('inpt--error') ) {date.addClass( 'inpt--error' );}
			if( !startInpt.hasClass('inpt--error') ) {startInpt.addClass( 'inpt--error' );}
			if( !endInpt.hasClass('inpt--error') ) {endInpt.addClass( 'inpt--error' );}
		}
		if ( !moment(startTime).isBefore( endTime, 'minute' ) ) { // время окончания позже времени начала
			errors.push( 'неверно указано время' ); //TODO проверять длительнось события не короче 5 минут
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
					eventStart: moment( startTime ).utc(),
					eventEnd: moment( endTime ).utc(),
				}
			);
		}
	}
	deleteEvent(e) {
		e.preventDefault();
		this.setState({
			showModal: 'deleted',
		});
	}
	deleteDelete(e) {
		if( this.props.eventToDownload ) {
			this.props.removeEvent({
					mutation: 'removeEvent',
					variables: {
						id: this.props.eventToDownload
					}
				})
				.then(({ data }) => {
					console.log('got data delete', data);
					this.setState({
						showModal: '',
					});
					
				}).catch((error) => {
				console.log('there was an error sending the query delete', error);
			});
		}
	}
/**
* Function saveEvent Запускает валидацию и сохраняет событие в БД
* @parpam {object} e Событие клика на кнопку "Сохранить"
*/
	saveEvent(e) { // TODO запустить мутации
		console.log( 'save clicked' );
		e.preventDefault();
		
		if ( this.eventmode === 'event' ) {
			// запускаем валидацию, получаем или список параметров встречи или список ошибок
			let parameters = this.validation();
			console.log( 'parameters', parameters, 'errors', this.errors );
			
			if( this.errors.length > 0 ) { // если ошибка валидации - показываем модальное окно с ошибкой
				this.setState({
					showModal: 'error',
				});
			} else { //ошибок валидации нет
				// выбираем добавленных пользователей ( что есть в "стало", чего нет в "было" )
				let addedUsers = this.state.selectedUsers.filter( ( el ) => {
					return this.initialEventUsers.indexOf( el ) === -1;
				} );
				// выбираем удаленных пользователей ( что есть в "было", чего нет в "стало" )
				let deletedUsers = this.initialEventUsers.filter( ( el ) => {
					return this.state.selectedUsers.indexOf( el ) === -1;
				} );
				console.log( 'добавлены пользователи', addedUsers, 'удалены пользователи', deletedUsers );
				// определяем, изменилась ли комната
				let roomHasChanged = this.initialEventRoom !== this.state.selectedRoom;
				console.log( 'комната изменилась', roomHasChanged );
				// определяем, менялись ли параметры события title, dateStart, dateEnd
				let newEventInfo = this.state.dateInPicker.format( 'DD MMMM, YYYY' ) + ', ' + $( '#timeStart' ).val() + ' - ' + $( '#timeEnd' ).val() + ' ' + $( '#eventTheme' ).val();
				let eventHasChanged = this.initialEventInfo !== newEventInfo;
				
				// Строка с информацией для модального кна
				this.eventInfo = this.state.dateInPicker.format( 'DD MMMM YYYY' ) +
					', ' +
					$( '#timeStart' ).val() +
					' - ' +
					$( '#timeEnd' ).val() +
					' ' +
					$( '.recomendation--selected' ).attr( 'data-roomname' );
				
				// запускаем мутацию updateEvent если менялись параметры события
				if ( eventHasChanged ) {
					console.log( 'updateEvent' );
					
					this.props.updateEvent({
							mutation: 'changeEvent',
							variables: {
								input: {
									title: parameters.eventTheme,
									dateStart: parameters.eventStart,
									dateEnd: parameters.eventEnd,
								},
                id: this.props.eventToDownload,
							}
						})
						.then(({ data }) => {
							this.setState({
								showModal: 'updated',
							});
						}).catch((error) => {
						console.log('there was an error sending the query create', error);
					});
				}
				// запускаем мутацию removeUsersFromEvent если есть удаленные для каждого индекса в массиве
				if ( deletedUsers.length ) {
					
					deletedUsers.forEach( ( item ) => {
						console.log( 'удаляю', item.id );
						this.props.removeUser({
								mutation: 'removeUserFromEvent',
								variables: {
									evId: this.props.eventToDownload, // ID события
									userId: item.id, // ID пользователя
								}
							})
							.then(({ data }) => {
								console.log( data );
								this.setState({
									showModal: 'updated',
								});
							}).catch((error) => {
							console.log('there was an error sending the query create', error);
						});
					})
				}
				// запускаем мутацию addUsersToEvent если есть добавленные
				if ( addedUsers.length ) {
					addedUsers.forEach( ( item ) => {
						this.props.addUser({
								mutation: 'addUserToEvent',
								variables: {
									evId: this.props.eventToDownload, // ID события
									userId: item.id, // ID пользователя
								}
							})
							.then(({ data }) => {
								console.log( data );
								this.setState({
									showModal: 'updated',
								});
							}).catch((error) => {
							console.log('there was an error sending the query create', error);
						});
					})
					
				}
				// changeEventRoom ( если менялась комната )
				if ( roomHasChanged ) {
					console.log( 'changeEventRoom', this.state.selectedRoom, this.props.eventToDownload );
					
					this.props.changeRoom({
							mutation: 'changeEventRoom',
							variables: {
								evId: this.props.eventToDownload, // ID события
								roomId: this.state.selectedRoom, // ID пользователя
							}
						})
						.then(({ data }) => {
							this.setState({
								showModal: 'updated',
							});
						}).catch((error) => {
						console.log('there was an error sending the query create', error);
					});
					
				}
				
				// обнуляем указание на модальное окно
				this.setState({
					showModal: '',
				});
			}
		}
		// конец для режима event
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
			} else { // все заполнено верно, запускаем мутацию craeteEvent (считатеся, что проверка занятости переговорок находится в recomendations, а занятость участников не проверяется)
				this.eventInfo = this.state.dateInPicker.format( 'DD MMMM YYYY' ) +
					', ' +
					$( '#timeStart' ).val() +
					' - ' +
					$( '#timeEnd' ).val() +
					' ' +
					this.roomInfo;
				
				this.setState({
					showModal: '',
				});
				
				this.props.craeteEvent({
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
	
	handleAddUser( user ) {
		if ( user ) {
			this.state.selectedUsers.push(user);
			this.changer();
		}
	}

	handleRemoveUser( user ) {
		let x;
		this.state.selectedUsers.map((item, i)=> {
			if(item.login === user) { x = i } return null;
		});
		this.state.selectedUsers.splice( x, [1]);
		this.changer();
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
/**
 * Ожидаем загрузку пользователей
 */
		if(!this.props.data.users) {
			return null;
		}
/**
 * Function blockInpts определяет, нужно ли блокировать форму для изменений
 * @return {boolean}
 */
		let blockInpts = () => {
			return ( this.eventmode === 'event' && this.butterflyEffect( this.props.data.event.dateStart ) );
		};
/**
 * Заполняем изначальных участников для режима event
 */
		if ( this.eventmode === 'event' && this.initialEventUsers.length === 0 ) {
			this.initialEventUsers = this.eventLoader().participants;
		}
/**
 * заполняем изначальную комнату
 */
		if ( this.eventmode === 'event' && this.initialEventRoom === '' ) {
			this.initialEventRoom = this.eventLoader().room;
		}
/**
 * Заполняем изначальную информацию о встрече
 */
// формат, this.state.dateInPicker.format( 'DD MMMM YYYY' ) + ', ' + $( '#timeStart' ).val() + ' - ' + $( '#timeEnd' ).val();
		if ( this.eventmode === 'event' && this.initialEventInfo === '' ) {
			this.initialEventInfo = this.eventLoader().date + ', ' + this.eventLoader().startTime + ' - ' + this.eventLoader().endTime + ' ' + this.eventLoader().theme;
		}
		
console.log( 'пропс', this.props, 'стейт', this.state );
/**
 * Function showModal отпределяет, нужно ли показывать модальное окно и если нужно, то какое именно.
 * @returns Компонент <Modal /> с параметрами.
 */
		let showModal = () => {
			if( this.state.showModal === 'error' ) {
				return ( <Modal message = {this.errors} type = "error" fixHandler = {this.fixErrors} />);
			} else if ( this.state.showModal === 'succes' ) {
				return ( <Modal message = 'Встреча создана!' type = 'succes' eventInfo = {this.eventInfo} /> );
			} else if ( this.state.showModal === 'updated' ) {
				return ( <Modal message = 'Встреча обновлена!' type = 'updated' eventInfo = {this.eventInfo} /> );
			} else if ( this.state.showModal === 'deleted' ) {
				return ( <Modal message = 'Встреча будет удалена безвозвратно!' type = "deleted" deleteHandler = {this.deleteDelete} /> );
			} else {
				return null;
			}
		};
/**
 * Function getHeading определяет, какой выводить заголовок.
 * @returns {string} Строка заголовка.
 */
		let getHeading = () => {
			if ( this.eventmode === 'new' || this.eventmode === 'make/:data' ) {
				return 'Новая встреча';
			} else {
				return 'Редактирование встречи';
			}
		};
/**
 * Function getStartEndTimes определяет время начала и конца для новых событий, созданных из плюсика и дату и время для режима просмотра/редактирования. Берет все символы после второго символа тире.
 * @returns {string} Строка заголовка.
 */
		let getStartEndTimes = () => {
				let StartEndTimes = {};
			if ( this.eventmode === "make/:data" ) {
				const str = this.props.parent.props.routeParams.data;
				let timeslot = str.substr( str.lastIndexOf('-') + 1 );
				StartEndTimes.start = timeslot + ':00';
				StartEndTimes.end = (+timeslot + 1) + ':00'
			} else if ( this.eventmode === "event" ) { // добавить чтение из события если режим события
				StartEndTimes.start = moment(this.props.data.event.dateStart).utc().format( 'HH:MM' );
				StartEndTimes.end = moment(this.props.data.event.dateEnd).utc().format( 'HH:MM' );
			} else {
				StartEndTimes.start = '';
				StartEndTimes.end = '';
			}
			return StartEndTimes;
		};
/*
 * @const target будет использовано в скрипте автокомплита.
 * @type {string} 
 */
		let target;
/*
 * @const block нужно или нет дизейблить поля ввода.
 * @type {Boolean}
 */
		let block;
		if ( this.eventmode === 'event' ) {
			block = this.butterflyEffect( this.props.data.event.dateStart );
		}
		
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
									className ='inpt event__text-inpt'
									type='text' id ='eventTheme'
									placeholder ='О чем будете говорить?'
									disabled = { blockInpts() }
									/>
							</div>
							<div className='event__col'>
								<div className='date-time-inpt'>
									<div className='date-time-inpt__date'>
										<label className='label label--desktop' htmlFor='eventDate'>Дата</label>
										<label className='label label--touch' htmlFor='eventDate'>Дата и время</label>
										<DatePicker
											selected = { this.state.dateInPicker || moment() }
											onChange = { this.changerTest }
											dateFormat="DD MMMM, YYYY"
											id="eventDate"
											className="inpt date-time-inpt__date-inpt"
											readOnly={true}
											disabled = { blockInpts() }
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
												defaultValue = { getStartEndTimes().start }
												disabled = { blockInpts() }
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
												defaultValue = { getStartEndTimes().end }
												disabled = { blockInpts() }
											/>
										</div>
									</div>
								</div>
							</div>
							<div className='event__separator'></div>
						</div>
						<div className='event__row'>
							<div className='event__col' >
								<label className='label' htmlFor='eventUsersInpt'>Участники</label>
								<Autocomplete
									inputProps={{
										id: 'eventUsersInpt',
										className: 'inpt event__text-inpt',
										placeholder: 'Например, Тор Одинович',
										disabled: block
									}}
									wrapperStyle = {{}}
									getItemValue={(item) => item.login}
									items={ this.state.userlist || [] }
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
											if (item.login === usrname ) {target = item}
										});
										if ( this.state.selectedUsers.indexOf( target ) === -1 ) {
											this.handleAddUser( target );
										}
										this.forceUpdate();
									}}
								/>
								<EventParticipants users = {this.state} parent = {this} blockInpts = { blockInpts() } />
							</div>
							<div className='event__separator'></div>
							<EventRecomendations parent = {this} selectedRoom = {this.state.selectedRoom} recomendations = {this.state.recomendations} isPast = { blockInpts() } />
						</div>
					</div>

					<EventFooter mode={this.eventmode} saveHandler = {this.saveEvent} deleteHandler = {this.deleteEvent} isDisabled = { blockInpts() } />
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
	graphql( gql`
		mutation changeEvent ( $id: ID!, $input: EventInput!) {
      updateEvent (id: $id, input: $input ) {
		    id
		    title
		    dateStart
		    dateEnd
      }
		}
	`, {name: 'updateEvent'} ),
	graphql( gql`
		mutation removeUser ( $evId: ID!, $userId:ID! ) {
      removeUserFromEvent ( id: $evId, userId: $userId ) {
        id
        users {
          id
        }
      }
		}
	`, { name: 'removeUser' } ),
	graphql( gql`
		mutation addUser ( $evId: ID!, $userId:ID! ) {
      addUserToEvent ( id: $evId, userId: $userId ) {
        id
        users {
          id
        }
      }
		}
	`, { name: 'addUser' } ),
	graphql( gql`
		mutation changeRoom ( $evId: ID!, $roomId:ID! ) {
		  changeEventRoom ( id: $evId, roomId: $roomId ) {
		    id
		    room {
		      id
		    }
		  }
		}
	`, { name: 'changeRoom' } ),
	graphql(gql` mutation removeEvent ($id: ID!) { removeEvent (id: $id) { id } }`, {name: 'removeEvent'}),
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
	`, {name: 'craeteEvent'})

)(Eventeditor);
