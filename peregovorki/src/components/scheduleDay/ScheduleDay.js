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
		this.makeDooms = this.makeDooms.bind(this);
		this.fillByEmpty = this.fillByEmpty.bind(this);
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
		//console.log('nodesAndInners', nodesAndInners);
		this.makeDooms(nodesAndInners);
		this.fillByEmpty();
		// создадим обычный массив объектов с нодами и массивом его иннеров
	}
	
	componentDidUpdate() {
		let allEvents = this.getEvents();
		let todayEvents = this.getTodayEvents(allEvents);
		//let todayNodes = this.getNodes(todayEvents);
		let nodesAndInners = this.pasteInners( this.getNodes(todayEvents) );
		//console.log( 'todayNodes', todayNodes, 'todayEvents ', todayEvents );
		//console.log( this.pasteInners( this.getNodes(todayEvents) ) );
		//console.log( 'nodezz', this.getNodes(todayEvents) );
		console.log('nodesAndInners', nodesAndInners);
		this.makeDooms(nodesAndInners);
		this.fillByEmpty();
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
		console.log('arr', arr); // обычный массив нод и их иннеров
		//сортируем иннеры
		for (let i in arr ) {
			//console.log( 'to sort', arr[i].inners );
			arr[i].inners.sort( (a,b) => {
				if( a.beginInterval > b.beginInterval ) {
					return 1;
				} else if ( a.beginInterval === b.beginInterval ) {
					return 0;
				} else {
					return -1;
				}
			} );
			//console.log(arr[i].inners);
		}
		// TODO отсортировать ноды по интервалу начала(и так отсортированы... магия?), реализовать алгоритм создания DOM узлов
		// создаем наконец узлы
		for ( let i in arr ) {
			for ( let k in arr[i].inners) {
				let inners = arr[i].inners; // внутренние
				let node = arr[i].node; // нода
				
				if (inners.length === 1) { // пересмотреть ширину эмпти и генерацию ширины бизи
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
					
					
					// if ( inners[0].beginInterval === 1 ) {
					// 	node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[0].width + 'r" data-event="' + inners[0].eventId + '"></div>' ); // первый занятый
					// 	let emptywidth1 = 12 - inners[1].beginInterval - inners[0].width - 1;
					// 	let emptywidth2 = 12 - inners[0].width - inners[1].width - emptywidth1;
					// 	node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + emptywidth1 +'"></div>' ); // первый пустой
					// 	let needR =	() => { (inners[1].ifEnding)? needR = 'r' : needR = '' };
					// 	node.append( '<div class="schedule__innerslot schedule__innerslot--busy schedule__innerslot--w' + inners[1].width + needR() + ' data-event="' + inners[1].eventId + '"></div>' ); // втрой занятый
					// 	node.append( '<div class="schedule__innerslot schedule__innerslot--emptyw' + emptywidth1 +'"></div>' ); // второй пустой
					// }
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
		//console.log( allrows[0].classList.contains( 'schedule__rowslot--floor' ) );
		//for ( let i = 0; i < allrows.length; i++ ) {
		// 	for (let row in allrows) {
		// 		if ( !row.classList.contains('schedule__rowslot--floor') && row.childNodes.length === 0 ) {
		// 			console.log ( row );
		// 		}
			// }
		//}
	};
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
				id: "11",
				title: "Test2",
				dateStart: "2018-01-19T12:35:01.981Z",
				dateEnd: "2018-01-19T12:40:00.981Z",
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
				id: "11",
				title: "Test2",
				dateStart: "2018-01-19T13:00:01.981Z",
				dateEnd: "2018-01-19T14:00:00.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "5"}
			},
			{
				id: "12",
				title: "Test2",
				dateStart: "2018-01-19T11:10:00.981Z",
				dateEnd: "2018-01-19T11:30:00.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "3"}
			},
			{
				id: "13",
				title: "Test2",
				dateStart: "2018-01-19T11:40:00.981Z",
				dateEnd: "2018-01-19T11:55:00.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "3"}
			},
			{
				id: "14",
				title: "Test2",
				dateStart: "2018-01-19T15:00:00.981Z",
				dateEnd: "2018-01-19T15:20:00.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "3"}
			},
			{
				id: "15",
				title: "Test2",
				dateStart: "2018-01-19T15:30:00.981Z",
				dateEnd: "2018-01-19T16:00:00.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "3"}
			},
			{
				id: "16",
				title: "Test2",
				dateStart: "2018-01-19T15:00:00.981Z",
				dateEnd: "2018-01-19T16:00:01.981Z",
				users: [ {"id": "1"}, {"id": "2"}, {"id": "4"} ],
				room: {"id": "1"}
			},
			
		];
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
						if ( dur > 60 && +begin.format ( 'HH' ) < itm && +end.format ( 'HH' ) > itm ) { // слотов много, это средний слот, он полностью заполнен
							return 12
						} else if (dur === 60 && +begin.format ( 'HH' ) === itm && +end.format ( 'HH' ) > itm) {
							return 12
						} else if ( +begin.format ( 'HH' ) === itm && slots.length > 1) { // слотов много, это первый слот
							if ( startInterval === 1 ) {
								return 12 - startInterval + 1;
							} else {
								return 12 - startInterval +1;
							}
						} else if ( +begin.format ( 'HH' ) === itm && slots.length === 1  ) { // слот один
							if ( startInterval === 1 ) {
								return endInterval - startInterval +1;
							} else {
								return endInterval - startInterval +1;
							}
						} else if ( dur === 60 && +begin.format ( 'HH' ) === itm ) {
							console.log('сработало');
							return 12;
						} else { // это последний слот
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
		console.log( 'x', x );
		
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


