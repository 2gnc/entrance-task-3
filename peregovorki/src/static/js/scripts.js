$(function($) {
	$( '.autocomplete' ).niceScroll(
		"div.autocomplete__wrapper",
		{
			cursorwidth: "10px",
			cursorcolor:"#d5dfe9",
			cursorborderradius: "100px",
			emulatetouch: true,
			autohidemode: false,
			railpadding: {
				top: 0,
				right: 3,
				left: 0	,
				bottom: 0
			},
			cursorfixedheight: 40
		}
	);
});

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
				roomsbox.css( 'left', pageXOffset );
			}
			
		}
	}
}(jQuery));
	
