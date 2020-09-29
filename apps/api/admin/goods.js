let router=new require('koa-router')();
const Goods=require('@/models/admin/goods');

//添加  POST                  /goods/
/*
username, password
*/
router.post('/', async ctx=>{
  try{
    await Goods.addShop(ctx.request.fields, ctx.admin.ID);
    ctx.body={msg: 'ok'};
  }catch(e){
    console.log(e);
    ctx.status=400;
    ctx.body=e;
  }
});


//删除  DELETE                /team/:id



//获取成员列表    GET         /team/




module.exports=router.routes();
