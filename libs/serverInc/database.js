const mysql=require('promise-mysql');
const __db=require('@/mods/__databases');

const config=require('@/config');

module.exports=async function (){
  for(let name in config.databases){
    let db=await mysql.createPool(config.databases[name]);

    await db.query(`SHOW TABLES`);
    db.insert=function (table, fields){
      return this.query(`INSERT INTO ?? (${Object.keys(fields).map(a=>'??').join(',')}) VALUE(${Object.keys(fields).map(a=>'?').join(',')})`, [
        table,
        ...Object.keys(fields),
        ...Object.values(fields)
      ])
    };


    __db[name]=db;
  }
};
