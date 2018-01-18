import React, { Component } from 'react';
import moment from 'moment';
import Timeslot from "../timeslot/Timeslot";
import $ from 'jquery';

export default class ScheduleDay extends Component {
	constructor( props ) {
		super( props );
		//this.getDoomSlots = this.getDoomSlots.bind(this);
		this.getTodayEvents = this.getTodayEvents.bind(this);
		this.getEvents = this.getEvents.bind(this);
		this.getNodes = this.getNodes.bind(this);
		this.pasteInners = this.pasteInners.bind(this);
	}
	
	componentDidMount() {
		$( '.timing__day-to-display' ).on( 'click', ()=>{
			setTimeout(()=>{this.forceUpdate();}, 100);
		});
		let allEvents = this.getEvents();
		let todayEvents = this.getTodayEvents(allEvents);
		//let todayNodes = this.getNodes(todayEvents);
		let nodesAndInners = this.pasteInners( this.getNodes(todayEvents) );
		//console.log( 'todayNodes', todayNodes, 'todayEvents ', todayEvents );
		//console.log( this.pasteInners( this.getNodes(todayEvents) ) );
		//console.log( 'nodezz', this.getNodes(todayEvents) );
		console.log('nodesAndInners', nodesAndInners)
	}
	
	componentDidUpdate() {
		let allEvents = this.getEvents();
		let todayEvents = this.getTodayEvents(allEvents);
		//let todayNodes = this.getNodes(todayEvents);
		let nodesAndInners = this.pasteInners( this.getNodes(todayEvents) );
		//console.log( 'todayNodes', todayNodes, 'todayEvents ', todayEvents );
		//console.log( this.pasteInners( this.getNodes(todayEvents) ) );
		//console.log( 'nodezz', this.getNodes(todayEvents) );
		console.log('nodesAndInners', nodesAndInners)
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
			
			
			
			//создаем объект
			// let obj ={};
			// if (isItUnique) {
			// 	obj.node = targetNode;
			// 	obj.inners = [];
			// 	todayEvents[k].innerBusySlot.forEach( (item, i) => {
			// 		obj.inners.push(item);
			// 	} );
			// } else { // значит объект уже есть
			//
			// }
			//tests.push(obj);
			// конец объекта
			
		};

		return tests;
	}
	//
	// [ {
	// 		node: node,
	// 		inners: [{inner}, {inner}]
	// 	}
	// 	]
	//
	// получим все уникальные ноды на выбранный день, сделаем массив с объектаи нода - ее иннеры
	pasteInners( nodez ) {
		//console.log( nodez );
		
		let nodesAndInners = [];
		
		for ( let i = 0; i < nodez.length; i++ ) {
			
			let id = nodez[i].node.attr ( 'id' );
			
			//console.log( i, 'создаю ИД', id);
			
			if( nodesAndInners[id] === undefined ) {
				
				nodesAndInners[ id ] = {
					inners: []
				};
				//console.log ( 'создаю структуру', nodesAndInners[ id ] );
			}
				nodesAndInners[id].node = nodez[i].node;
				nodesAndInners[id].inners.push ( nodez[i].inner );
				//console.log(i);
			
			// if(nodesAndInners[id]){
			// 	nodesAndInners[id].inners.push(nodes[ i ].inner)
			// } else {
			// 	nodesAndInners[id] = {
			// 		inners: []
			// 	};
			// }
			
		}
		// for(let item in nodesAndInners){
		// 	//console.log('pss', nodesAndInners[item].node )
		// };
		// console.log( 'nodesAndInners', nodesAndInners);
		return nodesAndInners;
	}
	// getDoomSlots() {
	// 	let slots = document.getElementsByClassName( 'schedule__rowslot' );
	// 	let targetSlots = [];
	// 	for ( let i = 0; i < slots.length; i++ ) {
	// 		if( slots[i].classList.length === 1 ) {
	// 			targetSlots.push( slots[i] );
	// 		}
	// 	}
	// 	return targetSlots;
	// }
	getEvents() {
		let testEvent = [
			{
				id: "1",
				title: "ШРИ 2018 - начало",
				dateStart: "2017-12-13T19:05:36.981Z",
				dateEnd: "2017-12-13T20:20:36.981Z",
				users: [ {"id": "1"}, {"id": "2"} ],
				room: {"id": "1"}
			},
			{
				id: "2",
				title: "Test",
				dateStart: "2018-01-18T19:15:36.981Z",
				dateEnd: "2018-01-18T19:40:36.981Z",
				users: [ {"id": "1"}, {"id": "2"} ],
				room: {"id": "2"}
			},
			{
				id: "3",
				title: "Test2",
				dateStart: "2018-01-18T19:40:36.981Z",
				dateEnd: "2018-01-18T20:35:36.981Z",
				users: [ {"id": "1"}, {"id": "2"} ],
				room: {"id": "5"}
			},
			{
				id: "4",
				title: "Test2",
				dateStart: "2018-01-18T19:00:01.981Z",
				dateEnd: "2018-01-18T20:00:57.981Z",
				users: [ {"id": "1"}, {"id": "2"} ],
				room: {"id": "2"}
			},
			{
				id: "5",
				title: "Test2",
				dateStart: "2018-01-18T11:00:01.981Z",
				dateEnd: "2018-01-18T14:00:57.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "3"}
			},
			{
				id: "6",
				title: "Test2",
				dateStart: "2018-01-18T11:00:01.981Z",
				dateEnd: "2018-01-18T11:20:57.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "1"}
			},
			{
				id: "7",
				title: "Test2",
				dateStart: "2018-01-18T11:30:01.981Z",
				dateEnd: "2018-01-18T12:00:57.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "1"}
			},
			{
				id: "8",
				title: "Test2",
				dateStart: "2018-01-19T11:30:01.981Z",
				dateEnd: "2018-01-19T11:59:57.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "5"}
			},
			{
				id: "9",
				title: "Test2",
				dateStart: "2018-01-19T12:10:01.981Z",
				dateEnd: "2018-01-19T12:30:00.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "5"}
			},
			{
				id: "10",
				title: "Test2",
				dateStart: "2018-01-19T12:40:01.981Z",
				dateEnd: "2018-01-19T12:50:00.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "5"}
			}
		];
		let x = testEvent.map(( item, i ) => {
			let startSlot = +moment ( item.dateStart ).utcOffset ( 0 ).format ( 'H' );
			let startTime = moment ( item.dateStart ).utcOffset ( 0 );
			let endTime = moment ( item.dateEnd ).utcOffset ( 0 );
			let duration = Math.floor ( ( moment ( item.dateEnd ) - moment ( item.dateStart ) ) / 60000 ); // в минутах
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
					//console.log( item.id, ' короткое событие в одном часе', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
					slots.push ( startSlot );
				} else if ( duration < 60 && startTime.format ( 'H' ) !== endTime.format ( 'H' ) ) {
					//console.log( item.id, 'короткое событие в разных часах', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
					slots.push ( startSlot, startSlot + 1 );
				} else if ( duration === 60 && startTime.format ( 'mm' ) === '00' ) {
					//console.log( item.id, 'ровно час с начала часа', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
					slots.push ( startSlot );
				} else if ( duration >= 60 ) {
					//console.log( item.id, 'час и больше часа', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
					while ( duration > 0 ) {
						slots.push ( startSlot + count );
						count++;
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
							return Math.floor ( begin.format ( 'mm' ) / 5 ) + 1;
						} else {
							return 1;
						}
					};
					/**
					 * Function getIntervalWidth возвращает ширину иннер слота в интервалах (ширина может быть от 1 до 12 включительно), в зависимости от позиции слота-родителя (является ли он серединой, началом или концом события)
					 * @return {number}
					 */
					let getIntervalWidth = () => {
						if ( +begin.format ( 'HH' ) === itm && slots.length === 1 ) {
							return (
								( Math.floor ( end.format ( 'mm' ) / 5 ) + 1 ) - getBeginInterval ()
							)
						} else if ( +begin.format ( 'HH' ) === itm && slots.length > 1 ) {
							return 12 - getBeginInterval ();
						} else if ( dur > 60 && +begin.format ( 'HH' ) < itm && +end.format ( 'HH' ) > itm ) {
							return 12;
						} else {
							return Math.floor ( end.format ( 'mm' ) / 5 );
						}
					};
					
					let getCss = () => {
						let modifier = '';
						if ( getIntervalWidth () === 12 ) {
							modifier = 12;
						} else if ( getEnding () === true ) {
							modifier = getIntervalWidth () + 'r';
						} else {
							modifier = getIntervalWidth ();
						}
						return 'schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + modifier;
					};
					
					let getEnding = () => {
						return ( +end.format ( 'HH' ) === itm );
					};
					/**
					 * @typedef {object} Описывает один внутренний занятый слот в рамках одного таймслота (часа) для события. Если событие длится более часа, то задействовано будет больше одного таймслота.
					 * @property {number} timeslot Таймслот, внутри которого будет создан иннерслот
					 * @property {number} beginInterval Интервал, с которого начинается иннер.
					 * @property {number} width Количество занятых интервалов. Интервал - 5 минут. Если эвент занимает весь таймслот, то ширина иннера - 12.
					 * @property {boolean} ifEnding является ли данный иннер конечным (влияет на css - модификатор)
					 * @property {string} cssClass Строка с классом, DOM-элемента, соответствующего иннеру.
					 */
					return ({
						timeslot: itm,
						beginInterval: getBeginInterval (),
						width: getIntervalWidth (),
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
		//console.log( 'получаем события на ', this.props.dayToDisplay);
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


