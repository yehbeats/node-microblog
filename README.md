# nodejs
实例代码是在书中章节5.5之前

##各个版本
* node v0.12.1
* npm 2.5.2
* express 4.13.4

##更改之处

###创建工程

####1 安装express
```
npm install -g express
```
因为在`express4.0`中将命令工具分离了出来，所以要使用`express`命令,需要安装`express-generator`

```
npm install -g express-generator
```

在书中使用了`ejs`模板引擎，但express现在默认的是jade引擎，所以在创建工程时
，使用如下命令
```
express -e microblog
```
进入目录，执行
```
npm install
```
使用命令
```
npm start
```
启动，或
```
node ./bin/www
```
####2 渲染
在routes文件夹下，有`index`和`user`两个js文件，可以理解为分别对应两个不同的功能块映射。
#####2.1 片段视图
新版的express不支持ejs模块的partials方法，所以需要自己额外安装模块
```
npm install express-partials
```
然后在app.js中添加
```javascript
var partials = require('express-partials');
app.use(partials());
```
然后再使用书中的代码

或者，使用自带的`include`方法，也很方便，操作具体如下

将`list.ejs`中代码：

```
<ul>
	<%- partials('listitem', itmes) %>
</ul>
```
改为：

```
<ul>
	<% items.forEach(function(listitem) { %>
	<% include listitem %>
	<% }) %>
</ul>
```
将`listitem.ejs`中代码为：
```
<li><%= listitem %></li>
```

#####2.2 视图助手
这一块改动比较大，已经废除了书中的helpers和dynamicHelpers。将代码改为如下：

**app.js**中，注意的是这段代码需要写在`app.use('/', routes)`和`app.use('/users', users)`之前。
```
app.use(function(req, res, next) {
	res.locals.headers = req.headers;
	res.locals.inspect = function(obj) {
		return util.inspect(obj, true);
	};
	next();
});
```
**views/helper.ejs**中
```
<h1><%= title %></h1>
<%=inspect(headers)%>
```
**routes/helper.js**中
```
var express = require('express');
var router = express.Router();

/* GET helper page. */
router.get('/', function(req, res, next) {
  res.render('helper',{ title:'Helper' });
});

module.exports = router;
```
因为把`helper`路由单独定义在了routes文件夹中，所以需要在`app.js`中引入
```
var helper = require('./routes/helper');
app.use('/helper', helper);
```

