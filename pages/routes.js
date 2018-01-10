const express = require('express');
const router = express.Router();
const { index } = require('./controllers');
//const { test } = require('./controllers');

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
} );


module.exports = router;
