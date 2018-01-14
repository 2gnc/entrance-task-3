import React, { Component } from 'react';
import Floor from '../floor/Floor';
import $ from 'jquery';

export default class Rooms extends Component {
	
	componentDidMount() {
		(function ($){
			if ( $( '.schedule__aside' ).length > 0 ) {
				const aside = $( '.schedule__aside' )[ 0 ].clientWidth;
				const roomsbox = $( '.rooms' );
				const rooms = $ ( '.room__name' );
				const floors = $( '.rooms__floor-name' );
				let check = false;
				
				document.addEventListener ( 'scroll', switcher );
				
				function switcher () {
					
					if ( window.pageXOffset > aside && !check ) {
						check = true;
						rooms.toggleClass ( 'room__name--swiped' );
						roomsbox.toggleClass( 'rooms--swiped' );
						floors.toggleClass( 'rooms__floor-name--swiped' );
					}
					
					if ( window.pageXOffset <= aside && check ) {
						check = false;
						rooms.toggleClass ( 'room__name--swiped' );
						roomsbox.toggleClass( 'rooms--swiped' );
						floors.toggleClass( 'rooms__floor-name--swiped' );
						roomsbox.removeAttr( 'style' );
					}
					
					if( window.pageXOffset > aside ) {
						roomsbox.css( 'left', window.pageXOffset );
					}
					
				}
			}
		}($));
	}
	
	render() {
	
	let floors = this.props.rooms.map(
		(items, i) => {
			let rooms = items.rooms;
			return <Floor number={i} key={i} rooms={rooms} />
		}
	);
	
	return (
		<div className = "rooms">
			{floors}
		</div>
		
		)
	}
}
