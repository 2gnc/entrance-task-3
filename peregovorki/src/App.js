import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Header from './components/header/Header'
import Timing from './components/timing/Timing'

//сделать пофайловый импорт статич ресурсов
//import './App.css';

class App extends Component {
	render() {
		console.log( this.props.data.users );
		return (
			<div className="App__wrapper">
				<Header />
				<Timing />
			</div>
		);
	}
};


//для компонентов, использующих данные
export default graphql(gql`{ users {id, login } }`, {})(App);
