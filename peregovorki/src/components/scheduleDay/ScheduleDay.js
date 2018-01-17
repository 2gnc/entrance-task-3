import React, { Component } from 'react';
import moment from 'moment';
import Timeslot from "../timeslot/Timeslot"

export default class ScheduleDay extends Component {
	
	render() {

		//let start = moment('2017-12-13T19:12:36.981Z');
		//let end = moment('2017-12-13T20:12:36.981Z');

		//console.log(start, end, (end - start) / 60000);
		//console.log("Schedule day", this.props);


/*  */
let testEvent = [
	{
		id: "1",
		title: "ШРИ 2018 - начало",
		dateStart: "2017-12-13T19:12:36.981Z",
		dateEnd: "2017-12-13T20:20:36.981Z",
		users: [ {"id": "1"}, {"id": "2"} ],
		room: {"id": "1"}
	},
	{
		id: "2",
		title: "Test",
		dateStart: "2017-12-13T19:12:36.981Z",
		dateEnd: "2017-12-13T19:40:36.981Z",
		users: [ {"id": "1"}, {"id": "2"} ],
		room: {"id": "2"}
	},
	{
		id: "3",
		title: "Test2",
		dateStart: "2017-12-13T19:40:36.981Z",
		dateEnd: "2017-12-13T20:35:36.981Z",
		users: [ {"id": "1"}, {"id": "2"} ],
		room: {"id": "2"}
	},
	{
		id: "4",
		title: "Test2",
		dateStart: "2017-12-13T19:00:01.981Z",
		dateEnd: "2017-12-13T20:00:57.981Z",
		users: [ {"id": "1"}, {"id": "2"} ],
		room: {"id": "2"}
	},
	{
		id: "5",
		title: "Test2",
		dateStart: "2017-12-13T11:00:01.981Z",
		dateEnd: "2017-12-13T14:00:57.981Z",
		users: [ {"id": "1"}, {"id": "2"} ],
		room: {"id": "2"}
	}
];

let testEventsStage1 = testEvent.map( (item, i) => {
	
	let startSlot =  + moment( item.dateStart ).utcOffset(0).format('H');
	let startTime = moment(item.dateStart).utcOffset(0);
	let endTime = moment(item.dateEnd).utcOffset(0);
	let duration = Math.floor( ( moment( item.dateEnd ) - moment( item.dateStart ) ) / 60000 ); // в минутах
	let count = 0;
	
	let getEventSlots = (startSlot, start, end, duration) => {
		let slots = [];
		if ( duration < 60 && startTime.format('H') === endTime.format('H') ) {
			//console.log( item.id, ' короткое событие в одном часе', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
			slots.push( startSlot );
		} else if( duration < 60 && startTime.format('H') !== endTime.format('H') ) {
			//console.log( item.id, 'короткое событие в разных часах', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
			slots.push( startSlot, startSlot + 1 );
		} else if ( duration === 60 && startTime.format('mm') === '00' ) {
			//console.log( item.id, 'ровно час с начала часа', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
			slots.push( startSlot );
		} else if( duration >= 60 ) {
			//console.log( item.id, 'час и больше часа', 'длительность', duration, startTime.format('HH:mm'), endTime.format('HH:mm') );
			while ( duration  > 0 ) {
				slots.push( startSlot + count );
				count ++;
				duration -= 60;
			}
 		} else {  }
		return slots;
	};
	
	let eventSlots = getEventSlots( startSlot, startTime, endTime, duration );
	
 	let getSlotInners = ( slots, dur, begin ) => {

 		let arr = slots.map((itm, i)=> { // для каждого таймслота из списка занятых
 			if( dur <= 60 ) {
 				return ({
 					timeslot: itm,
 					begin: '', // минуты начала округлить, / 5 + 1 = номер интервала, с которого начинается событие
 					width: Math.round( dur / 5 ), // интервалы по 5 минут - количество интервалов в событии
 					isFinale: false,
 					modifier: '',  // тут модификатор, описывающий внутренний busy-слот, его ширину w1-w12, интервал, с которого он начинается (0-11), и в рамках данного timeslot оканчивается ли event или распространяется на след слот (если таймслотов >1, то распространяется во всех слотах кроме последнего), а также сгенерированную строку - класс для div-а
 				})
 			} else {
 				return ({
 					timeslot: itm,
 					//begin: '',
 					//width: Math.round( dur / 5 ), // интервалы по 5 минут
 					//isFinale: false,
 					//modifier: '', // тут модификатор, описывающий внутренний busy-слот, его ширину w1-w12, интервал, с которого он начинается (0-11), и в рамках данного timeslot оканчивается ли event или распространяется на след слот (если таймслотов >1, то распространяется во всех слотах кроме последнего), а также сгенерированную строку - класс для div-а
 				});
 			}
 		});
	  console.log( slots, arr );
 		return arr;
 	};

	return ({
		eventId: +item.id,
		eventTitle: item.title,
		eventStart: moment( item.dateStart ),
		eventEnd: moment( item.dateEnd ),
		eventDuration: duration,
		startSlot: startSlot,
		targetSlots: eventSlots,
		innerBusySlot: getSlotInners( eventSlots, duration, startSlot ), // массив объектов {слот, массив внутренних слотов}
		})
} );

console.log('testEventsStage1', testEventsStage1);


/* */		
		let rooms = this.props.rooms;
		console.log(rooms);

		// 

		function makeSlots() {
			let now = +moment().format('HH');
			let arr = [];
			let cl = '';
			for( let i = 0; i <= 16; i++ ) {
				if( i === 0 ) {
					cl = "schedule__timeslot schedule__timeslot--first";
					arr.push( <Timeslot position={cl} key={i} disabled={true} rooms={rooms} spec="isfirst" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				} else if( i === 16 ) {
					cl = "schedule__timeslot schedule__timeslot--last";
					arr.push( <Timeslot position={cl} key={i} disabled={true} rooms={rooms} spec="islast" x={i} time={i + 7} isnow={( now === (i+7))} /> )
				} else {
					cl="schedule__timeslot";
					arr.push ( <Timeslot position={cl} key={i} disabled={false} rooms={rooms} spec="ismid" x={i} time={i + 7} isnow={( now === (i+7))} /> )
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


