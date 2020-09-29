const {web}=require('@/mods/__databases');
const {main}=require('@/mods/__redis');

async function getAll(){
  // const key='__mt_all_catalog';
  //
  // let str=await main.getAsync(key);
  //
  // if(str){
  //   try{
  //     return JSON.parse(str);
  //   }catch(e){}
  // }

  let items=await web.query(`
SELECT
  item.ID as ID,
  item.title AS item_title, item.href AS item_href,
  sub.title AS sub_title, sub.href AS sub_href,
  position, sub.\`order\` AS sub_index
FROM
  catalog_item_table AS item
  LEFT JOIN sub_catalog_table AS sub ON item.sub_catalog_ID=sub.ID
ORDER BY
  sub.\`position\` ASC, item.\`order\` ASC
  `);
  let catalogs=await web.query(`SELECT position,title,href FROM catalog_table ORDER BY position ASC, \`order\` ASC;`);

  //
  let result=[];
  catalogs.forEach(({ID, position,title,href})=>{
    if(!result[position]){
      result[position]={
        titles: [],
        children: []
      }
    }

    result[position].titles.push({title, href});
  });

  items.forEach(({ID, position, item_title, sub_title, item_href, sub_href, sub_index})=>{
    if(!result[position].children[sub_index]){
      result[position].children[sub_index]={
        title: sub_title,
        href: sub_href,
        children: []
      }
    }

    result[position].children[sub_index].children.push({
      ID,
      title: item_title,
      href: item_href
    })
  });

  //
  // await main.setAsync(key, JSON.stringify(result));

  return result;
}

module.exports={
  getAll
};
