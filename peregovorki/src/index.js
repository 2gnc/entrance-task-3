import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
	link: new HttpLink({ uri: 'http://localhost:3001/graphql' }),
	cache: new InMemoryCache()
});

//client.query({ query: gql` query {users {id, login}}` }).then(console.log);

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);

