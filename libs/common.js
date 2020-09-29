const fs=require('fs');
const path=require('path');

const crypto=require('crypto');

function md5(data){
  let obj=crypto.createHash('md5');
  obj.update(data);
  return obj.digest('hex');
}

const pass_key=fs.readFileSync(path.resolve(__dirname, '../password_key.txt')).toString();
function password(str){
  return md5(str+pass_key);
}

const pass_key_admin=fs.readFileSync(path.resolve(__dirname, '../password_key_admin.txt')).toString();
function admin_password(str){
  return md5(str+pass_key_admin);
}


const uuidLib=require('uuid/v4');

function uuid(){
  return uuidLib().replace(/\-/g, '');
}



module.exports={
  md5,
  password, admin_password,
  uuid
};
