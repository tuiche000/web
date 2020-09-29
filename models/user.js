const {web}=require('@/mods/__databases');
const {password, uuid}=require('@/libs/common');

async function getUserByMobile(mobile){
  let res=await web.query(`SELECT * FROM user_table WHERE mobile=?`, [mobile]);

  return res[0];
}

async function reg(mobile, pass){
  await web.query(`INSERT INTO user_table (ID, mobile, password, avatar, name) VALUE(?,?,?,'default_avatar.jpg','美团用户')`, [uuid(), mobile, password(pass)]);
}

async function login(mobile, pass){
  let rows=await web.query(`SELECT * FROM user_table WHERE mobile=?`, [mobile]);

  if(rows.length==0){
    return '此手机号未注册';
  }

  if(rows[0].password!=password(pass)){
    return '账户信息有误';
  }

  return null;
}


module.exports={
  getUserByMobile,
  reg, login
}
