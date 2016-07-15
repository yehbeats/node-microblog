# Node.js开发指南 代码
最近自己在学习node.js，网上也有很多人推荐了《Node.js开发指南》这本书，写的非常通俗易懂，但是毕竟是2012年出版的，现在前端工具更新如此之快，书中的代码已不能运行，有些方法在新版中被废气。所以一边学习，一边搜索最新的写法。

分支的中代码都已在本机运行通过，并标注了目前所使用的各个工具的版本

* master  microblog 完整的实现
* node-0  简单的例子，体会express，对应书中5.4节
* node-1  连接mongodb数据库，利用bootstrap实现简单的用户登录登出，对应书中5.5节和5.6节
* node-2  实现发表文章功能，对应书中5.7节

##Tools

* node： v4.4.7
* npm： 2.15.8
* express： 4.13.4
* connect-mongo： 1.2.1
* mongodb： 2.2.1
* express-session： ^1.14.0

##How To Start

启动`MongoDB数据库服务`

```
npm install
npm start
```