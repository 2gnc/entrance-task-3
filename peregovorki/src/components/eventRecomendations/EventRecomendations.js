import React, { Component } from 'react';
import Room from '../room/Room';
import $ from 'jquery';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

class EventRecomendationsEmpty extends Component {
	constructor( props ) {
		super(props);
		this.state = {
			selectedRoom: '',
		};
		
	}

	componentDidMount() {
		// если в пропсах пришла выбранная комната, устанавливаем ее в стейт.
		setTimeout( () => {
			if ( this.props.selectedRoom ) {
				this.setState({
					selectedRoom: this.props.selectedRoom,
				});
			}
			if ( !this.props.isPast ) {
				setTimeout( setClicksHandler , 200 );
			}
		}, 500 );
/** 
 * Fucntion setClicksHandler устанавливает обработчики событий на блоки с рекомендацией. Устанавливает отсрочку, чтобы <Rom/> усплели подгрузиться.
 */
		let setClicksHandler = ()=> {
			$( document ).ready( () => {
				$( '.recomendation__box' ).on( 'click', ( '.recomendation' ), (event)=>{
					event.stopPropagation();
					
					let selectedRoomId = $( event.target.closest('.recomendation') ).attr( 'data-roomid' );
					let selectedRoomName = $( event.target.closest('.recomendation') ).attr( 'data-roomname' );
					let selectedRoomFloor = $( event.target.closest('.recomendation') ).attr( 'data-roomfloor' );
					
					this.props.parent.selectedRoomUpd( selectedRoomId, selectedRoomName, selectedRoomFloor );
					if( this.state.selectedRoom !== this.props.selectedRoom ) {
						this.setState({
							selectedRoom: this.props.selectedRoom
						});
					}
				});
			});
		};
	}
	
	render() {
		/** Заглушка
		* Редерит полученные рекомендации
		* */
		if(!this.props.data.rooms) {
			return null;
		}
		
		let roomsIds = this.props.data.rooms;
		
		let rooms = roomsIds.map( (items, i)=>{
			return (
				<Room
					roomId = {items.id}
					name = {items.title}
					layout = 'inrecomendations'
					floor = {items.floor}
					key = {i}
					isSelected = { this.state.selectedRoom === items.id }
				/>
			);
		});
		
		const getRoomName = ( roomId ) => {
			for( let i = 0; i < this.props.data.rooms.length; i++ ) {
				if ( this.props.data.rooms[i].id === roomId ) {
					return this.props.data.rooms[i].title
				}
			}
		};
		
		const getFloor = ( roomId ) => {
			for( let i = 0; i < this.props.data.rooms.length; i++ ) {
				if ( this.props.data.rooms[i].id === roomId ) {
					return this.props.data.rooms[i].floor
				}
			}
		};
		
		const getTime = ( recomendation ) => {
			let timeStart = moment( recomendation.date.start ).utc().format( 'HH:mm' );
			let timeEnd = moment( recomendation.date.end ).utc().format( 'HH:mm' );
			return timeStart + ' - ' + timeEnd;
		};
		
		let recomendations = this.props.recomendations.map( ( item, i ) => {
			return (
				<Room
					roomId = {item.id}
					name = { getRoomName( item.room.id ) }
					layout = 'inrecomendations'
					floor = { getFloor( item.room.id ) }
					time = { getTime( item ) }
					key = {i}
					isSelected = { true }
				/>
			)
		} );
		
		/*Конец заглушки*/
		if ( this.props.isPast && this.props.recomendations.length === 1 ) {
			return (
				<div className='event__col event__col--recomendation'>
					<div className='label'>Ваша переговорка: </div>
					<div className='recomendation__box'>
						{recomendations}
					</div>
				</div>
			)
		} else if ( !this.props.isPast && this.props.recomendations.length >= 1 ) {
			return (
				<div className='event__col event__col--recomendation'>
					<div className='label'>Рекомендованные переговорки</div>
					<div className='recomendation__box'>
						{rooms}
					</div>
				</div>
			)
		} else {
			return (
				<div className='event__col event__col--recomendation'>
					<div className='label'>Рекомендованные переговорки</div>
					<div className='recomendation__box'>
						{rooms}
					</div>
				</div>
			)
		}
	}
}

const roomsQuery = gql`
	query {
  rooms {
    id
    title
    capacity
    floor
  }
  events {
    id
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
`;

const EventRecomendations = graphql(roomsQuery)(EventRecomendationsEmpty);
export default EventRecomendations;
