const assert=require('assert');
const mods={
  'group': require('./items/meishi_group'),
  'film': require('./items/film'),
  'smalltalk': require('./items/small_talk'),
};


module.exports=function (type){
  let mod=mods[type];
  assert(mod);

  assert(mod.getById);
  assert(mod.search);

  return mod;
}
