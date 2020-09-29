let router=new require('koa-router')();
const Team=require('@/models/admin/team');

//添加  POST                  /team/
/*
username, password
*/
router.post('/', async ctx=>{
  const {username,password}=ctx.request.fields;

  try{
    await Team.addUser(username, password, ctx.admin.ID);
    ctx.body={msg: 'ok'};
  }catch(e){
    // console.log(e);
    ctx.status=400;
    ctx.body=e;
  }
});


//删除  DELETE                /team/:id



//获取成员列表    GET         /team/




module.exports=router.routes();
