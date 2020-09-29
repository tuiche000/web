const Router=require('koa-router');
const User=require('@/models/user');
const {main}=require('@/mods/__redis');
const fs=require('promise-fs');
const path=require('path');

let router=new Router();

router.get('/s', async ctx=>{
  let arr=JSON.parse(Buffer.from(ctx.query.q, 'base64').toString());

  //补充数据：时间、ip、浏览器、ID
  let res=[];
  for(let i=0;i<arr.length;i++){
    let item=arr[i];

    let time=Date.now();
    //let ip=?;   //?
    let ua=ctx.get('user-agent');
    let uid=ctx.cookies.get('uid')||item.uid;
    let {bid, data}=item;

    let str=JSON.stringify({
      time, ua, uid, bid, data
    });

    res.push(str);
  }

  let oDate=new Date();
  let name='./bidatas_'+oDate.getFullYear()+oDate.getMonth()+oDate.getDate()+oDate.getHours()+oDate.getMinutes();
  await fs.appendFile(path.resolve(__dirname, name), res.join('\n')+'\n');

  ctx.body='';
});


module.exports=router.routes();
