import React, { Component } from 'react';
import Room from '../room/Room';
import $ from 'jquery';

export default class EventRecomendations extends Component {
	constructor( props ) {
		super(props);
		this.state = {
			selectedRoom: '',
		};
	}
	componentDidMount() {
		$( document ).ready(() => {
			$( '.recomendation__box' ).on( 'click', ( '.recomendation' ), (event)=>{
				event.stopPropagation();
				let selectedRoomId = $(event.target.closest('.recomendation')).attr('data-roomid');
				this.props.parent.selectedRoomUpd( selectedRoomId );
				if( this.state.selectedRoom !== this.props.selectedRoom ) {
					this.setState({
						selectedRoom: this.props.selectedRoom
					});
				}
			});
		});
	}
	render() {

		/*Заглушка
		* тут будем получать массив подходящих на дату-время комнат
		* */
		let roomsIds = [
			{
				"id": "1",
				"title": "404",
				"capacity": 5,
				"floor": 4
			},
			{
				"id": "2",
				"title": "Деньги",
				"capacity": 4,
				"floor": 2
			},
			{
				"id": "3",
				"title": "Карты",
				"capacity": 4,
				"floor": 2
			},
			{
				"id": "4",
				"title": "Два ствола",
				"capacity": 4,
				"floor": 2
			},
			{
				"id": "5",
				"title": "3.14",
				"capacity": 6,
				"floor": 3
			},
			{
				"id": "6",
				"title": "Выручай - комната",
				"capacity": 12,
				"floor": 0
			}];
		/*Конец заглушки*/
		
		let rooms = roomsIds.map((items, i)=>{
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