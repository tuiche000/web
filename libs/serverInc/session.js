const session=require('koa-session');
const {main}=require('@/mods/__redis');
const fs=require('fs');
const path=require('path');

module.exports=async function (app){
  app.keys=fs.readFileSync(path.resolve(__dirname, '../../.keys')).toString().split(/\r\n|\r|\n/).filter(line=>line);

  app.use(session({
    maxAge: 2*3600*1000,    //2小时
    autoCommit: true,       //自动写入
    renew: true,            //自动延期
    httpOnly: true,
    signed: true,
    store: {
      async get(key, maxAge){
        let str=await main.getAsync(key);

        try{
          return JSON.parse(str);
        }catch(e){
          return {};
        }
      },
      async set(key, session, maxAge){
        await main.psetexAsync(key, maxAge, JSON.stringify(session));
      },
      async destroy(key){
        await main.delAsync(key);
      }
    }
  }, app));
};
