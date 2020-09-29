const {web}=require('@/mods/__databases');
const {uuid}=require('@/libs/common');

module.exports={
  async addShop(shopData, ownerID){
    shopData.ID=uuid();
    shopData.adminID=ownerID;

    return web.insert('meishi_shop_table', shopData);
  }
};
