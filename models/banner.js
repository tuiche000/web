const {web}=require('@/mods/__databases');

async function getAll(){
  let rows=await web.query('SELECT * FROM meituan.banner_table ORDER BY `position`, `order`');

  let sliders=[];
  let banners=[];

  rows.forEach(item=>{
    item.img=`/files/`+item.img;

    if(item.position==1)sliders.push(item);
    else banners.push(item);
  });

  return {sliders, banners};
}

module.exports={
  getAll
};
