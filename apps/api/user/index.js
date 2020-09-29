let router=new require('koa-router')();

router.use('/cart', require('./cart'));
router.use('/user', require('./user'));



module.exports=router.routes();
