const express = require('express');
const router = express.Router();
const { index } = require('./controllers');

//try1
const {graphql} = require('graphql');
const scheme = require('./../models/scheme');

function query (str) {
	return graphql(scheme, str);
};


//


router.get( '/', index );

router.get( '/test', function (req, res) {
	res.send(
  
		[
			{
				id: 1,
				username: "samsepi0l"
			}, {
				id: 2,
				username: "D0loresH4ze"
			},
		]

    );
});

router.get( '/users', function (req, res) {
// как отправить запрос чтобы получить ответ от grqphql??
// возвращается пустой запрос
// вроде как нужна scheme, не пойму, где она

	let x = query( 'query {users {id, login }}');

	res.send( x );

});


module.exports = router;
