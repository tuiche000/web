const body=require('koa-better-body');
const convert=require('koa-convert');

module.exports=async function (app){
  app.use(convert(body({})));
};
