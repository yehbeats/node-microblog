var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*Hello page*/
router.get('/hello', function(req, res, next) {
	res.send('The time is' + new Date().toString());
});

/*partial view*/
router.get('/list', function(req, res) {
	res.render('list', {
		title: 'List',
		items: [1992, 'byzs', 'express', 'Node.js']
	});
});

module.exports = router;
