# nodejs
实例代码是在书中章节5.5和5.6

##各个版本
* node： v4.4.7
* npm： 2.15.8
* express： 4.13.4
* connect-mongo： 1.2.1
* mongodb： 2.2.1
* express-session： ^1.14.0

* mongodb数据库版本：3.2

##更改之处

###安装MongoDB数据库
确保本机已经安装了MongoDB数据库，并且服务已经启动，介绍简单的几个MongoDB的命令吧：

1. 启动服务  ./bin/mongod
2. 连接数据库 ./bin/mongo ==>默认连接test数据库
3. 显示当前连接数据库 db
4. 切换连接数据库 use microblog
5. 插入数据 db.col.insert({tilte: 'name'})
6. 查询数据 db.col.find()

###用户注册登录
####修改路由

采用index作为统一入口，在index中进行路由的分发，所以在`app.js`中，仅保留如下：
```
var routes = require('./routes/index');
app.use('/', routes);
```

则在`routes/index.js`中的路由控制为：
```
var reg = require('./reg');
var login = require('./login');
var logout = require('./logout');

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.use('/reg', reg);
router.use('/login', login);
router.use('/logout', logout);
```

分别对应登录、登出和注册，当然也需要创建好相应的`reg.js`、`login.js`和`logout.js`，并在`views`文件夹下创建好相对应的视图文件。

* tips：使用了bootstrap模板

####node.js访问mongodb

安装mongodb模块
```
npm install mongodb --save
```

在目录文件夹在新建`setting.js`，里面内容为：
```
module.exports = {
    cookieSecret: 'microblogbyvoid',//用于cookie加密
    url: 'mongodb://localhost/microblog',//Mongodb连接字符串URI
    db:'microblog'//数据库名称
};
```

在`models`子目录中`db.js`内容为：
```
var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;

var database = {};

database.open = function(fn) {
    MongoClient.connect(settings.url, function(err, db) {
        if (fn !== 'undefined' && typeof fn == 'function') {
            fn(err, db);
        }

        database.close = function() {
            db.close();
        };

        console.log("Connected correctly to server.");
    });
};

module.exports = database;
```

通过module.exports输出了创建的数据库连接。由于模块只会被加载一次，以后再其它文件中使用时均为这一个实例。

####会话配置
安装`connect-mongo`，会话信息存储在数据库中，便于持久维护
```
npm install connect-mongo --save
```

**注意以下的部分**：
若你的node的版本为低版本的`0.10`或`0.12`，则在`app.js`中添加下面的代码
```
var MongoStore = require('connect-mongo/es5')(session);

app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        url: settings.url
    })
}));
```

如果想支持es6，则需要升级node版本，在本机测试时，将node版本升级到了目前最新版本`v4.4.7`，如下代码：
```
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        url: settings.url
    })
}));
```

####注册和登录
目前express中已经将`req.flash`废弃，则需要安装`connect-flash`
```
npm install connect-flash --save
```

在`app.js`中添加：
```
var flash = require('connect-flash');
app.use(flash());
```

#####用户模型
在`models`目录中创建`user.js`，内容与书上相同。

#####视图交互
修改`app.js`中视图助手部分
```
app.use(function(req, res, next) {
    app.locals.user = function() {
        return req.session.user;
    };
    app.locals.regValidate = {
        statusStr: '',
        success: function() {
            var succ = this.statusStr = req.flash('success');
            if (succ.length) {
                return succ;
            } else {
                return null;
            }
        },
        error: function() {
            var err = this.statusStr = req.flash('error');
            if (err.length) {
                return err;
            } else {
                return null;
            }
        }
    };
    next();
});
```

因为有登录和登出两种状态，所以修改导航栏`header.ejs`
```
<ul class="nav navbar-nav">
    <li class="active"><a href="/">首页<span class="sr-only">(current)</span></a></li>
    <% if(!user) { %>
    <li><a href="/login">登入</a></li>
    <li><a href="/reg">注册</a></li>
    <% } else { %>
    <li><a href="/logout">登出</a></li>
    <% } %>
</ul>
```

在`header.ejs`的
```html
<div id="container" class="container">
```

之后，加上下面的代码：
```
<% if( regValidate.success()) { %>
    <div class="alert alert-success">
        <%= regValidate.statusStr %>
    </div>
<% } %>
<% if( regValidate.error()) { %>
    <div class="alert alert-danger">
        <%= regValidate.statusStr %>
    </div>
<% } %>
```

####页面控制权转移
修改`index.js`：
```
router.use('/login', checkNotLogin);
router.use('/login', login);

router.use('/logout', checkLogin);
router.use('/logout', logout);

function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error','未登录');
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','已登录');
		return res.redirect('/');
	}
	next();
}
```
