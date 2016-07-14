# Nodejs
实例代码是在书中章节5.7

##各个版本
* node： v4.4.7
* npm： 2.15.8
* express： 4.13.4
* connect-mongo： 1.2.1
* mongodb： 2.2.1
* express-session： ^1.14.0

* mongodb数据库版本：3.2

##更改之处


###微博
####修改路由

在`index.js`中，增加发表微博时`post`：
```
var post = require('./post');

router.use('/post', checkLogin);
router.use('/post', post);
```

增加用户路由控制，在`index.js`中再新增如下：
```
var user = require('./user');

router.use('/u', user);
```

则在`routes`文件夹中的新建post.js：
```
var express = require('express');
var router = express.Router();
var Post = require('../models/post');

router.post('/', function(req, res, next) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        res.redirect('/u/' + currentUser.name);
    });
});

module.exports = router;
```

在`routes`文件夹中的新建`user.js`，内容为：
```
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Post = require('../models/post');

/* GET User page. */
router.get('/:user', function(req, res, next) {
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
```

创建post模型，实现基本的插入和获取方法，具体代码在`models/post.js`中。

####修改视图

`views`文件夹新建`say.ejs`，内容为：

```
<!-- say.ejs -->
<form method="post" action="/post" class="well form-inline" style="text-align:
center;">
<div class="col-sm-10">
<input type="text" class="form-control" style="width:100%;" name="post"></div>
<button type="submit" class="btn btn-success"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
</i> 发言</button>
</form>
```

再新建`post.ejs`，里面内容为：
```
<!-- post.ejs -->
<% posts.forEach(function(post, index) {
    if (index % 3 == 0) { %>
    <div class="row">
        <% } %>
        <div class="col-xs-4">
            <h2><a href="/u/<%= post.user %>"><%= post.user %></a> 说</h2>
            <p><small><%= post.time %></small></p>
            <p><%= post.post %></p>
        </div>
        <% if (index % 3 == 2) { %>
    </div><!-- end row -->
    <% } %>
    <% }) %>
    <% if (posts.length % 3 != 0) { %>
</div><!-- end row -->
<% } %>
```

再新建`user.ejs`，里面内容为：
```
<!-- user.ejs -->
<%- include header.ejs %>

<% if(user) { %>
<%- include say.ejs %>
<% } %>

<%- include post.ejs %>

<%- include footer.ejs %>
```

再对首页进行修改，`index.js`，在路由取到根路径时，代码修改为：
```
router.get('/', function(req, res, next) {
    Post.get(null, function(err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index', {
            title: '首页',
            posts: posts
        });
    });
});
```

同时对`index.ejs`也需要进行修改：
```
<% if(!user()) { %>
<div class="jumbotron">
    <h1>欢迎来到 Microblog</h1>
    <p>Microblog 是一个基于 Node.js 的微博系统。</p>
    <p>
        <a href="/login" class="btn btn-primary btn-large">登录</a>
        <a href="/reg" class="btn btn-large">立即注册</a>
    </p>
</div>

<% } else { %>
<%- include say.ejs %>
<% } %>
<%- include post.ejs %>
```

##修改完成
使用`node ./bin/www`测试是否成功。现已全部完成。
