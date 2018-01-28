import React, { Component } from 'react';
import moment from 'moment';

export default class Now extends Component {
	render() {
		let current = moment().format('HH:mm');
/**
 * Function getClass определяет, какой временной подинтервал должен использоваться.
 * @return {string}
 */
		let getClass = () => {
			let interval = 5 * 60 * 1000;
			let x = moment(Math.ceil(moment() / interval) * interval).format('mm');
			return x;
		};
		let time = getClass();
/**
 * Function getModifier определяет, какой использовать CSS-модификатор (какой должен быть отступ слева внутри слота)
 * @return {string}
 */
		let getModifier = () => {
			if(time === '05') {
				return 'now--right1';
			} else if (time === '10') {
				return 'now--right2';
			} else if (time === '15') {
				return 'now--right3';
			} else if (time === '20') {
				return 'now--right4';
			} else if (time === '25') {
				return 'now--right5';
			} else if (time === '30') {
				return 'now--right6';
			} else if (time === '35') {
				return 'now--right7';
			} else if (time === '40') {
				return 'now--right8';
			} else if (time === '45') {
				return 'now--right9';
			} else if (time === '50') {
				return 'now--right10';
			} else if (time === '55') {
				return 'now--right11';
			} else {
				return 'now--right12';
			}
		};
/**
 * Function nowLineActualizer запускает обработчик события ресайза с троттлером. При ресайзе устанавливается высота линии now
 */
		let nowLineActualizer = ()=>{
			// установим изначальную высоту now = высоте контейнера schedule__day
			const standart = document.getElementsByClassName( 'schedule__day' )[0];
			const now = document.getElementById( 'nowline' );
			const offst = 24;
			now.style.height = standart.clientHeight + offst + 'px';
			// вешаем обработчик на ресайз
			window.addEventListener("resize", resizeThrottler, false);
			let resizeTimeout;
			function resizeThrottler() {
				if ( !resizeTimeout ) {
					resizeTimeout = setTimeout( function() {
						resizeTimeout = null;
						actualResizeHandler();
					}, 500);
				}
			}
			function actualResizeHandler() {
				let targetHeight = standart.clientHeight;
				now.style.height = targetHeight + offst + 'px';
			}
		};
		setTimeout( nowLineActualizer, 500 );
		return(
			<div className={ 'now ' + getModifier() }>
				<div className='now__time '>{ current }</div>
				<div className='now__line' id = 'nowline' />
			</div>
		)
	}
}