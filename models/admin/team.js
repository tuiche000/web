const {web}=require('@/mods/__databases');
const {admin_password, uuid}=require('@/libs/common');

module.exports={
  async addUser(username, password, parent){
    let rows=await web.query(`SELECT * FROM admin_table WHERE username=?`, [username]);
    if(rows.length>0){
      throw {msg: '此用户名已被占用'};
    }

    if(parent){
      rows=await web.query(`SELECT * FROM admin_table WHERE ID=?`, [parent]);
      if(rows.length==0){
        throw {msg: '指定的父账户不存在'};
      }
    }

    //3.插入
    await web.query(`INSERT INTO admin_table (username, password, parent) VALUE(?,?,?)`, [username, admin_password(password), parent]);
  }
}
