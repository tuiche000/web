const {web}=require('@/mods/__databases');
const {main}=require('@/mods/__redis');

const prefix='__meishi_shop_';
async function getDetail(id){
  let data=await main.getAsync(prefix+id);
  if(data){
    try{
      return JSON.parse(data);
    }catch(e){}
  }

  let rows=await web.query(`SELECT * FROM meishi_shop_table WHERE ID=?`, [id]);
  let shop=rows[0];

  //catalog
  let parentID=shop.catalogID;
  let catalogs=[];
  while(parentID){
    let rows=await web.query(`SELECT * FROM meishi_catalog_table WHERE ID=?`, [parentID]);
    if(rows.length==0)break;

    catalogs.push({
      name: rows[0].name, url: rows[0].url
    });

    parentID=rows[0].parentID;
  }
  catalogs=catalogs.reverse();

  //tags
  let tags=await web.query(`
    SELECT
      tag.img, tag.name
    FROM
      meishi_shop_tag_table AS shop_tag
      LEFT JOIN meishi_tag_table AS tag ON shop_tag.tagID=tag.ID
    WHERE
      shop_tag.shopID=?
  `, [shop.ID]);

  //groups
  let groups=await web.query(`SELECT * FROM meishi_group_table WHERE shopID=?`, [shop.ID]);

  let vouchers=await web.query(`SELECT * FROM meishi_voucher_table WHERE shopID=?`, [shop.ID]);

  let recommends=await web.query(`SELECT * FROM meishi_recommand_table WHERE shopID=?`, [shop.ID]);

  //comments
  let comments=(await web.query(`
    SELECT
      *, comment.ID AS ID
    FROM
      meishi_comment_table AS comment
      LEFT JOIN user_table AS user ON comment.userID=user.ID
  `)).map(comment=>{
    comment.desc=comment.desc.toString();
    comment.reply=comment.reply.toString();

    return comment;
  });



  let result={
    ...shop, catalogs, tags, groups, vouchers, recommends, comments
  };

  await main.setAsync(prefix+id, JSON.stringify(result));

  return result;
}

module.exports={
  getDetail
}
