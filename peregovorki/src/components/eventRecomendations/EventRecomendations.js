import React, { Component } from 'react';
import Room from '../room/Room';
import $ from 'jquery';


// все перенести на уровень выше, в EventRecomendations передавать props с ID выбранной комнаты из State эвент эдитора.
// при клике на комнуту в eventEditor обновится состояние и Recomendations перерисуется

export default class EventRecomendations extends Component {

	constructor( props ) {
		super(props);
		this.state = {
			selectedRoom: '',
		};
		this.clickHandler = this.clickHandler.bind(this);
	}

	componentDidMount() {
		$( '.recomendation__box' ).on( 'click', ( '.recomendation' ), (event)=>{
			event.stopPropagation();
			let selectedRoomId = $(event.target.closest('.recomendation')).attr('data-roomid');
			this.clickHandler(selectedRoomId);
		} )
	}

	clickHandler(room) {
		this.setState({
			selectedRoom: room
		})
	}

	render() {
		console.log( "state", this.state );
		let rooms;
		// тут будет на входе список ID возможных комнат
		if (this.state.selectedRoom === '') {
			console.log("case1");
			rooms =[
				<Room name="Тестовое имя" layout="inrecomendations" number="2" isSelected={false} roomId="1" key="1" />,
				<Room name="Тестовое имя" layout="inrecomendations" number="2" isSelected={false} roomId="2" key="2" />,
				<Room name="Тестовое имя" layout="inrecomendations" number="2" isSelected={false} roomId="3" key="3" />
			];
		} else {
			console.log("case1");
			rooms =[
				<Room name="Тестовое имя" layout="inrecomendations" number="2" isSelected={true} roomId="1" key="1" />,
				<Room name="Тестовое имя" layout="inrecomendations" number="2" isSelected={false} roomId="2" key="2" />,
				<Room name="Тестовое имя" layout="inrecomendations" number="2" isSelected={false} roomId="3" key="3" />
			];
		}

		
		return (
			<div>
				<div className="label">Рекомендованные переговорки</div>
				<div className="recomendation__box">
					{rooms}
				</div>
			</div>
		)
	}

}