var express = require('express');
var router = express.Router();

/* GET User page. */
router.get('/', function(req, res, next) {
	res.send('user page.');
});


module.exports = router;
