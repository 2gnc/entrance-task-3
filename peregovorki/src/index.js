import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Router, Route, IndexRoute, browserHistory } from 'react-router';

import Main from './layouts/Main';
import Test from './components/elements/Test';



import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
	link: new HttpLink({ uri: 'http://localhost:3001/graphql' }),
	cache: new InMemoryCache()
});


ReactDOM.render(
	<ApolloProvider client={client}>
		<Router history={browserHistory}>
			<Route path="/" component={Main} >
				<IndexRoute component={App} />
				<Route path="test" component={Test} />
				<Route path="event" component={Test} >
					<Route path=":eventId" component={Test} />
				</Route>
			</Route>
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
);

