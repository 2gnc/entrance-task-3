import React, { Component } from 'react';
import moment from 'moment';
import Timeslot from "../timeslot/Timeslot";
//import EventInline from "../eventInline/EventInline";
import $ from 'jquery';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class ScheduleDay extends Component {
	constructor( props ) {
		super( props );
		this.getTodayEvents = this.getTodayEvents.bind(this);
		this.getEvents = this.getEvents.bind(this);
		this.getNodes = this.getNodes.bind(this);
		this.pasteInners = this.pasteInners.bind(this);
		this.makeDooms = this.makeDooms.bind(this);
		this.fillByEmpty = this.fillByEmpty.bind(this);
		this.addEvents = this.addEvents.bind(this);
	}
	
	componentDidMount() {
		$( '.timing__day-to-display' ).on( 'click', ()=>{
			setTimeout(()=>{this.forceUpdate();}, 100);
		});
	}
	
	componentDidUpdate() {
		let allEvents = this.getEvents();
		let todayEvents = this.getTodayEvents(allEvents);
		let nodesAndInners = this.pasteInners( this.getNodes(todayEvents) );
		this.makeDooms(nodesAndInners);
		this.fillByEmpty();
		this.addEvents( todayEvents );
	}
	addEvents(todayEvents) {
		for ( let i = 0; i < todayEvents.length; i++ ) {
			let width = todayEvents[i].eventDuration / 5;
			let slot = todayEvents[i].innerBusySlot[0].timeslot;
			let allRooms = this.props.data.rooms;
			let room = todayEvents[i].eventRoom;
			let targetslot = $('div.schedule__rowslot[data-room='+room+'][data-time='+slot+']');
			let allusers = this.props.data.users; // все пользователи
			let eventStartDate =  todayEvents[i].eventStart.format('D MMMM');
			let eventStartTime = todayEvents[i].eventStart.utc().format('HH:mm');
			let eventEndTime =todayEvents[i].eventEnd.utc().format('HH:mm');;
			let eventTitle = todayEvents[i].eventTitle; // название события
			let firstUser = todayEvents[i].eventUsers[0]; // первый пользователь для отображения (ID)
			let numberOfUsers = todayEvents[i].eventUsers.length; // количество пользователей
			let firstUserName = () => {
				for (let i = 0; i < allusers.length; i++ ) {
					if ( allusers[i].id === firstUser ) { return allusers[i].login; }
				}
			};
			let firstUserAv = () => {
				for (let i = 0; i < allusers.length; i++ ) {
					if ( allusers[i].id === firstUser ) { return allusers[i].avatarUrl; }
				}
			};
			let roomName = ()=> {
				for (let i = 0; i < allRooms.length; i++ ) {
					if ( allRooms[i].id === room ) { return allRooms[i].title; }
				}
			};
			
			let slotsToListen =[];
			
			for ( let k = 0; k < todayEvents[i].innerBusySlot.length; k++ ) {
				let stl = todayEvents[i].innerBusySlot[k].timeslot;
				slotsToListen.push( $('div.schedule__rowslot[data-room='+room+'][data-time='+stl+']') );
			};
			
			$(slotsToListen[0].children( '.schedule__innerslot--busy' )[0]).on('klaz', (e)=>{
				$(e.target).children().css( 'visibility', 'visible' );
			});
			$(slotsToListen[0].children( '.schedule__innerslot--busy' )[0]).on('noklaz', (e)=>{
				if ( !$(e.target).children().hasClass( 'visible' ) ) {
					$(e.target).children().css( 'visibility', 'hidden' );
				}
				
			});
			
			for ( let i = 0; i < slotsToListen.length; i++ ){
				slotsToListen[i].hover(
					()=>{$(slotsToListen[0].children( '.schedule__innerslot--busy' )[0]).trigger('klaz')},
					()=>{$(slotsToListen[0].children( '.schedule__innerslot--busy' )[0]).trigger('noklaz');}
					);
				}

			targetslot.children( '.schedule__innerslot--busy' ).empty();
			targetslot.children( '.schedule__innerslot--busy' ).append(
				'<div class="schedule__event schedule__event--w' + width + '" ></div>'
			);
			
			targetslot.children( '.schedule__innerslot--busy' ).on( 'click', (e) => {
				
				console.log( $(e.target).children().length );
				
				$(e.target).toggleClass('visible');
				if ( $(e.target).children().length === 0 ) {
					$(e.target).append(
						'<div class="tooltip__triangle"></div>'+
						'<div class="tooltip">'+
							'<div class="icon icon--edit tooltip__icon"></div>'+
							'<div class="tooltip__heading">' + eventTitle + '</div>'+
							'<div class="tooltip__info">'+
								'<span class="tooltip__info-when">' + eventStartDate + ',' + eventStartTime + '-' + eventEndTime + '</span>'+
								'<span class="tooltip__info-where">·</span>'+
								'<span class="tooltip__info-where">' + roomName() + '</span>'+
							'</div>'+
							'<div class="tooltip__users">'+
								'<div class="user">'+
									'<img class="user__pic" src="' + firstUserAv() + '"/>' +
									'<div class="user__name">' + firstUserName() + '</div>'+
								'</div>'+
								'<div class="tooltip__other-users">и 12 участников</div>'+
							'</div>'+
						'</div>'
					)
				}
				
				document.addEventListener( 'click', (ev) => {
					if( $('.tooltip') && ev.target !== e.target ) {
						let x = targetslot.children('.schedule__innerslot--busy').children( '.schedule__event');
		
						x.removeClass('visible');
						x.empty();
						x.css( 'visibility', 'hidden' );
					}
				});
				
			});
		}
	}
	getNodes( todayEvents ) {
		let tests =[];
		let targetNodes =[];
		let room;
		let targetNode;
		for ( let k = 0; k < todayEvents.length; k++ ) { //каждое событие event
			room = todayEvents[k].eventRoom; //строка
			let timeslot;
			todayEvents[k].innerBusySlot.forEach( (item, m) => { // каждый innerSlot в эвенте
				timeslot = item.timeslot;
				targetNode = $('div.schedule__rowslot[data-room='+room+'][data-time='+timeslot+']'); // получили объект, туда положить inner!!!!  // нода, где должен быть иннер
				let obj ={};
				obj.node = targetNode;
				obj.inner = item;
				tests.push( obj );
			});
			let isItUnique = !targetNodes.find( x => $(x).attr( 'id' ) === $(targetNode).attr( 'id' ) );
			if ( isItUnique ) {targetNodes.push(targetNode)};
		};
		return tests;
	}

	pasteInners( nodez ) {

		let nodesAndInners = [];
		for ( let i = 0; i < nodez.length; i++ ) {
			let id = nodez[i].node.attr ( 'id' );
			if( nodesAndInners[id] === undefined ) {
				nodesAndInners[ id ] = {
					inners: []
				};
			}
				nodesAndInners[id].node = nodez[i].node;
				nodesAndInners[id].inners.push ( nodez[i].inner );
		}
		return nodesAndInners;
	}
	makeDooms(nodes){
		// очищаем все ноды
		$( '.schedule__rowslot' ).empty();
		let arr =[];
		for (let key in nodes) {
			let obj = {};
			obj.node = nodes[key].node;
			obj.inners = [];
			arr.push(
				obj
			);
			for (let i in nodes[key].inners) {
				obj.inners.push( nodes[key].inners[i] );
			}
		}
		for (let i in arr ) {
			arr[i].inners.sort( (a,b) => {
				if( a.beginInterval > b.beginInterval ) {
					return 1;
				} else if ( a.beginInterval === b.beginInterval ) {
					return 0;
				} else {
					return -1;
				}
			} );
		}
		// создаем наконец узлы
		for ( let i in arr ) {
			for ( let k in arr[i].inners) {
				let inners = arr[i].inners; // внутренние
				let node = arr[i].node; // нода
				if (inners.length === 1) {
					if( inners[0].beginInterval === 1 &&  inners[0].width === 12) { //с начала и до конца на все интервалы
						node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w12" data-event="' + inners[0].eventId + '"></div>' );
					} else if ( inners[0].beginInterval === 1 &&  inners[0].width < 12 ) { // сначала и короткий, он является завершающим в любом случае, раз после него пустой блок
						let emptywidth = 12 - inners[0].width;
						if( inners[0].width > 0 ) {
							node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[0].width + 'r" data-event="' + inners[0].eventId + '"></div>' );
						}
						node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + emptywidth +'"></div>' );
					} else if ( inners[0].beginInterval !== 1 &&  inners[0].width < 12 ) {
						let emptywidth = 12 - inners[0].width;
						node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + emptywidth +'"></div>' );
						if( inners[0].width > 0 ) {
							node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[0].width + 'r" data-event="' + inners[0].eventId + '"></div>' );
						}
					}
				} else if ( inners.length === 2 ) {
					node.empty();
					let e1w;
					let e2w;
					let e3w;
					if ( inners[0].beginInterval === 1 ) { // если занято сначала
						e1w = inners[1].beginInterval - inners[0].width - 1;
						e2w = 12 - inners[1].width - e1w - inners[0].width - 1;
						// первый полный, он всегда конечный
						node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[0].width + 'r" data-event="' + inners[0].eventId + '"></div>' );
						// первый пустой
						node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + e1w +'"></div>' );
						// второй полный, он всегда конечный
						node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[1].width + 'r" data-event="' + inners[1].eventId + '"></div>' );
						// второй пустой
						if (e2w) {node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + e2w +'"></div>' );}
					} else { // если сначала пусто
						e1w = inners[0].beginInterval - 1;
						e2w = inners[1].beginInterval - inners[0].width - e1w - 1;
						e3w = 12 - inners[1].width - e2w - inners[0].width - e1w;
						// первый пустой
						node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + e1w +'"></div>' );
						// первый полный
						node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[0].width + 'r" data-event="' + inners[0].eventId + '"></div>' );
						// второй пустой
						node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + e2w +'"></div>' );
						// второй полный (он конечный, если e3w === 0 и не конечный, если есть третий пустой интервал)
						if (e3w > 0) {
							if ( inners[1].ifEnding ) {
								// второй полный конечный
								node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[1].width + 'r" data-event="' + inners[1].eventId + '"></div>' );
							} else {
								// второй полный не конечный
								node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[1].width + '" data-event="' + inners[1].eventId + '"></div>' );
							}
							// третий пустой
							node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + e3w +'"></div>' );
						} else {
							if ( inners[1].ifEnding ) {
								// второй полный конечный
								node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[1].width + 'r" data-event="' + inners[1].eventId + '"></div>' );
							} else {
								// второй полный неконечный
								node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[1].width + '" data-event="' + inners[1].eventId + '"></div>' );
							}
						}
						// третий пустой если он не 0
					}
				}
			}
		}
	}
	fillByEmpty() {
		let allrows = $('.schedule__rowslot');
		for ( let i = 0; i < allrows.length; i++ ) {
			if ( !allrows[i].classList.contains( 'schedule__rowslot--floor' ) && allrows[i].childNodes.length === 0 ) {
				$(allrows[i]).append( '<div class="schedule__innerslot schedule__innerslot--emptyw12"></div>' );
			}
		}
	};

	getEvents() {
		let testEvent = this.props.data.events;
		let x = testEvent.map(( item, i ) => {
			let startSlot = +moment ( item.dateStart ).utcOffset ( 0 ).format ( 'H' );
			let startTime = moment ( item.dateStart ).utcOffset ( 0 );
			let endTime = moment ( item.dateEnd ).utcOffset ( 0 );
			let duration = Math.floor ( ( moment ( item.dateEnd ) - moment ( item.dateStart ) ) / 60000 ); // в минутах
			let eventId = item.id
			let count = 0;
/**
 * Function getEventSlots возвращает массив номеров таймслотов, которые заняты данным событием.
 * @param {number} startSlot слот, в котором началось событие
 * @param {number} duration длительность события в минутах
 * @return {Array} массив с номерами слотов
 */
			let getEventSlots = ( startSlot, duration ) => {
				let slots = [];
				
				if ( duration < 60 && startTime.format ( 'H' ) === endTime.format ( 'H' ) ) {
					slots.push ( startSlot );
				} else if ( duration < 60 && startTime.format ( 'H' ) !== endTime.format ( 'H' ) ) {
					slots.push ( startSlot, startSlot + 1 );
				} else if ( duration === 60 && startTime.format ( 'mm' ) === '00' ) {
					slots.push ( startSlot );
				} else if ( duration >= 60 ) {
					while ( duration >= 0 ) {
						slots.push ( startSlot + count );
						count ++;
						duration -= 60;
					}
				} else {
				
				}
				
				return slots;
			};
			let eventSlots = getEventSlots ( startSlot, duration );
/**
 * Function getSlotInners Для каждого слота формирует внутренние занятые слоты
 * @param {array} slots Массив занятых слотов
 * @param {number} dur длительность всего эвента в минутах
 * @param {object} begin экземпляр moment() с временем начала эвента
 * @param {object} end экземпляр moment() с временем конца эвента
 * @return {array} arr объект с параметрами внутреннего занятого слота в каждом таймслоте
 */
			let getSlotInners = ( slots, dur, begin, end ) => {
				let arr = slots.map ( ( itm, i ) => {
/**
 * Function getBeginInterval возвращает номер интервала, с которого начинается внутренний слот
 * @return {number}
 */
					let getBeginInterval = () => {
						if ( +begin.format ( 'HH' ) === itm ) {
							if ( Math.ceil ( begin.format ( 'mm' ) / 5 ) === 0 ) {
								return 1;
							} else {
								return Math.ceil ( begin.format ( 'mm' ) / 5 +1 );
							}
						} else {
							return 1;
						}
					};
/**
 * Function getIntervalWidth возвращает ширину иннер слота в интервалах (ширина может быть от 1 до 12 включительно), в зависимости от позиции слота-родителя (является ли он серединой, началом или концом события)
 * @return {number}
 */
					let getIntervalWidth = ( startInterval ) => {
						let endInterval = Math.round( end.format ( 'mm' ) / 5 );
						let begHour = +begin.format ( 'HH' );
						let endHour = +end.format ( 'HH' );
						
						if ( dur === 60 && begHour === itm && startInterval === 1 ) {// это полный час с начала часа
							//console.log(1);
							return 12
						} else if ( dur === 60 && begHour === itm && startInterval > 1 ) { // это полный час, голова
							//console.log(2);
							return 12 - startInterval + 1;
						} else if ( dur === 60 && begHour < itm ) {// это полный час, хвост
							//console.log(3);
							return endInterval;
						} else if ( dur < 60 && begHour === itm && startInterval === 1 ) {// это меньше часа, на один слот, с начала часа
							//console.log(4);
							return endInterval;
						} else if ( dur < 60 && begHour === itm &&  startInterval > 1 && endHour === itm ) { //это меньше часа на один слот, не с начала часа
							//console.log(5);
							return 12 - endInterval - startInterval + 1;
						} else if ( dur < 60 && begHour === itm && endHour > itm ) {//это меньше часа на два слота, голова
							//console.log(6);
							return 12 - startInterval - 1;
						} else if ( dur < 60 && begHour < itm && endHour === itm ) {//это меньше часа на два слота, хвост
							//console.log(7);
							return endInterval;
						} else if ( dur > 60 && endInterval === 0 && startInterval === 1 && begHour === itm ) { // частный случай, dur > 60 мин, но начало следующего слота округлено в меньую сторону 61,62 минуты (голова)
							//console.log(8);
							return 12;
						} else if ( dur > 60 && endInterval === 0 && startInterval === 1 && begHour < itm && dur < 63) { // частный случай, dur > 60 мин, но начало следующего слота округлено в меньую сторону 61,62 минуты (хвост) равно 0
							//console.log(9);
							return endInterval;
						} else if ( dur >= 63 && begHour === itm && startInterval === 1 ) { // событие больше часа, это голова, начало с начала часа
							//console.log(10);
							return 12;
						} else if ( dur >= 63 && begHour === itm && startInterval > 1 ) {// событие больше часа, это голова, начало с середины часа
							//console.log(11);
							return 12 - startInterval + 1;
						} else if ( dur >= 63 && begHour < itm && endHour > itm ) {// событие больше часа, это тело
							//console.log(12);
							return 12;
						} else {// событие больше часа, это хвост
							//console.log(13);
							return endInterval;
						}
					};
					
					let getCss = () => {
						let modifier = '';
						if ( getIntervalWidth ( getBeginInterval() ) === 12 ) {
							modifier = 12;
						} else if ( getEnding () === true ) {
							modifier = getIntervalWidth ( getBeginInterval() ) + 'r';
						} else {
							modifier = getIntervalWidth ( getBeginInterval() );
						}
						return 'schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + modifier;
					};
					
					let getEnding = () => {
						return ( +end.format ( 'HH' ) === itm );
					};
/**
 * @typedef {object} Описывает один внутренний занятый слот в рамках одного таймслота (часа) для события. Если событие длится более часа, то задействовано будет больше одного таймслота.
 * @property {string} eventId идентификатор события
 * @property {number} timeslot Таймслот, внутри которого будет создан иннерслот
 * @property {number} beginInterval Интервал, с которого начинается иннер.
 * @property {number} width Количество занятых интервалов. Интервал - 5 минут. Если эвент занимает весь таймслот, то ширина иннера - 12.
 * @property {boolean} ifEnding является ли данный иннер конечным (влияет на css - модификатор)
 * @property {string} cssClass Строка с классом, DOM-элемента, соответствующего иннеру.
 */
					return ({
						eventId: eventId,
						timeslot: itm,
						beginInterval: getBeginInterval (),
						width: getIntervalWidth ( getBeginInterval() ),
						ifEnding: getEnding (),
						cssClass: getCss (),  // тут модификатор, описывающий внутренний busy-слот, его ширину w1-w12, интервал, с которого он начинается (0-11), и в рамках данного timeslot оканчивается ли event или распространяется на след слот (если таймслотов >1, то распространяется во всех слотах кроме последнего), а также сгенерированную строку - класс для div-а
					});
				} );
				return arr;
			};
/**
 * Function getUsers возвращает массив пользователей в событии
 * @return {array} массив с ID пользователей
 */
			let getUsers = ( itm ) => {
				let arr = [];
				itm.users.forEach ( ( val, i, ar ) => {
					arr.push ( val.id );
				} );
				return arr;
			};
			
			return ({
				eventId: item.id,
				eventRoom: item.room.id,
				eventUsers: getUsers(item),
				eventTitle: item.title,
				eventStart: moment( item.dateStart ),
				eventEnd: moment( item.dateEnd ),
				eventDuration: duration,
				targetSlots: eventSlots,
				innerBusySlot: getSlotInners( eventSlots, duration, startTime, endTime),
			})
			
		});
		return x;
	};
	
	getTodayEvents( events ) {

		let todayEvents = [];
		events.forEach( ( item, i ) => {
			if ( item.eventStart.isSame( this.props.dayToDisplay, 'day' ) ) {
				todayEvents.push( item );
			}
		});
		return todayEvents;
	}
	render() {
	let isToday = this.props.dayToDisplay.isSame( moment(), 'day' );
	let rooms = this.props.rooms;
	
	
		function makeSlots() {
			let now = +moment().format('HH');
			let arr = [];
			let cl = '';
			for( let i = 0; i <= 16; i++ ) {
				if( i === 0 ) {
					cl = "schedule__timeslot schedule__timeslot--first";
					arr.push( <Timeslot isToday={isToday} position={cl} key={i} disabled={true} rooms={rooms} spec="isfirst" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				} else if( i === 16 ) {
					cl = "schedule__timeslot schedule__timeslot--last";
					arr.push( <Timeslot isToday={isToday} position={cl} key={i} disabled={true} rooms={rooms} spec="islast" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				} else {
					cl="schedule__timeslot";
					arr.push ( <Timeslot isToday={isToday} position={cl} key={i} disabled={false} rooms={rooms} spec="ismid" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				}
			}
			return arr;
		}
		let timeslots = makeSlots();
		return (
				<div className = "schedule__chart">
					{timeslots}
				</div>
		)
	}
}

export default graphql(gql`query {
  events { id title dateStart dateEnd users { id } room { id } }
  users {id login homeFloor avatarUrl }
	rooms {id title capacity floor }
  
}`, {})(ScheduleDay);