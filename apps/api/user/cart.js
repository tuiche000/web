let router=new require('koa-router')();
const {uuid}=require('@/libs/common');
const {web}=require('@/mods/__databases');

const itemFactory=require('@/models/item');

// 添加商品
// type, itemID
router.post('/', async ctx=>{
  const {type, itemID}=ctx.request.fields;
  let Item=itemFactory(type);
  if(!Item){
    ctx.status=400;
    ctx.body={msg: '找不到指定的类型'};
    return;
  }

  let data=await Item.getById(itemID);

  if(!data){
    ctx.status=400;
    ctx.body={msg: '指定商品不存在'};
    return;
  }

  let cartData={
    ID: uuid(),
    type,
    itemID,
    item_title: data.title,
    item_href: data.href,
    price: data.price,
    count: 1
  };

  await Item.save(cartData);
});

// 设置数量
// count
router.get('/set-count/:id', async ctx=>{
  const {id}=ctx.params;
  const {count}=ctx.query;

  await web.query(`UPDATE cart_table SET count=? WHERE ID=?`, [
    count, id
  ]);

  ctx.body={msg: 'ok'};
});

// 列表
router.get('/list', async ctx=>{
  ctx.body=await web.query(`SELECT * FROM cart_table`);
});




module.exports=router.routes();
