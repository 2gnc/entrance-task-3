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
		/*Заглушка
		* тут будем получать массив подходящих на дату-время комнат
		* */
		
		if(!this.props.data.rooms) {
			return null;
		}
		
		let roomsIds = this.props.data.rooms;
		/*Конец заглушки*/
		
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
