var express = require('express');
var router = express.Router();

/* GET helper page. */
router.get('/', function(req, res, next) {
  res.render('helper',{ title:'Helper' });
});


module.exports = router;
