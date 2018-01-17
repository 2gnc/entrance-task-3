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
		dateEnd: "2017-12-13T20:12:36.981Z",
		users: [ {"id": "1"}, {"id": "2"} ],
		room: {"id": "1"}
	},
	{
		id: "2",
		title: "Test",
		dateStart: "2017-12-13T19:12:36.981Z",
		dateEnd: "2017-12-13T20:30:36.981Z",
		users: [ {"id": "1"}, {"id": "2"} ],
		room: {"id": "2"}
	}
]



let testEventsStage1 = testEvent.map( (item, i) => {

	let start =  + moment( item.dateStart ).utcOffset(0).format('H');
	let duration = ( moment( item.dateEnd ) - moment( item.dateStart ) ) / 60000;

	let getEventSlots = (start, duration) => {
		let slots = [];
		if( duration <= 60 ) {
			slots.push( start )
		} else {
			let x = Math.floor(duration/60);
			for (let j = 0; j <= x; j ++ ) {
				slots.push( start + j);
			}
		}
		return slots;
	};

	let activeSlots = getEventSlots( start, duration );

 	let getSlotInners = ( slots, dur, begin ) => {

 		let arr = slots.map((itm, i)=> { // для каждого таймслота из списка занятых
 			if( dur <= 60 ) {
 				return ({
 					timeslot: itm,
 					begin: '',
 					width: Math.round( dur / 5 ), // интервалы по 5 минут
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
 				})
 			}
 		});
 		return arr;

 	};

	return ({
		eventId: +item.id,
		eventTitle: item.title,
		eventStart: moment( item.dateStart ),
		eventEnd: moment( item.dateEnd ),
		eventDuration: duration,
		startSlot: start,
		targetSlots: activeSlots,
		innerBusySlot: getSlotInners(activeSlots, duration, start), // массив объектов {слот, массив внутренних слотов}
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


