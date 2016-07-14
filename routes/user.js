var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Post = require('../models/post');

/* GET User page. */
router.get('/:user', function(req, res, next) {
	console.log(req.params.user);
	User.get(req.params.user, function(err, user) {
		if(!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.get(req.params.user, function(err, posts) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('user', {title:user.name, posts:posts});
		});
	});
});


module.exports = router;
