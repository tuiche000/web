// const Koa=require('koa');
//
// let app=new Koa();
//
// app.listen(8080);


const http=require('http');
const Koa=require('koa');

let app=new Koa();

let httpServer=http.createServer(app.callback());

httpServer.listen(8080);

setTimeout(function (){
  console.log('开始close');
  httpServer.close(()=>{    //
    console.log('彻底结束');
  });
}, 5000);
