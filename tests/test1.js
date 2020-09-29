const mysql=require('promise-mysql');

(async ()=>{
  let db=await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'meituan'
  });

  let rows=await db.query('SELECT * FROM admin_table');

  console.log('a', rows[1].goods_view[0], 'b');
})();
