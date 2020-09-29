const {web}=require('@/mods/__databases');

const table='meishi_group_table';

function transformRow(row){
  if(!row)return undefined;

  row.title=row.name;
  row.href=`/shop/${row.shopID}`;
}

module.exports={
  async getById(id){
    let rows=await web.query(`SELECT * FROM ?? WHERE ID=?`, [table, id]);

    return transformRow(rows[0]);
  },
  async search(key){
    let rows=await web.query(`SELECT * FROM ?? WHERE name LIKE ?`, [table, `%${key}%`]);

    return rows.map(transformRow);
  },
  async save(row){
    await web.insert(table, row);
  }
}
