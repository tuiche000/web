const Koa = require('koa');
const path = require('path');
const http = require('http');
const static = require('koa-static');

module.exports = async function (config) {
  const { port, entry } = config;

  let app = new Koa();

  app.config = app.context.config = config;

  //body数据
  await require('@/libs/serverInc/body')(app);

  //创建数据库连接
  await require('@/libs/serverInc/database')();

  //创建redis连接
  await require('@/libs/serverInc/redis')();

  //创建session
  await require('@/libs/serverInc/session')(app);

  //渲染
  await require('@/libs/serverInc/render')(app);

  app.use(static(path.resolve(__dirname, '../static')));

  //把入口文件引用过来
  app.use(require(entry));

  let httpServer = http.createServer(app.callback());
  httpServer.listen(port, () => {
    console.log(`服务开始工作:`, port);
  });

  return httpServer;
};






Number.prototype.time2date = function () {
  let oDate = new Date(this);

  return oDate.getFullYear() + '年' + (oDate.getMonth() + 1) + '月' + oDate.getDate() + '日';
};
