module.exports={
  async getById(id){

  },
  async search(key){

  },
  getTitle(row){
    return row.title;
  },
  getHref(row){
    return `/small-talk/${row.ID}`;
  }
}
