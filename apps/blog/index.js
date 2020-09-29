const Router = require('koa-router');
const { main } = require('@/mods/__redis');

let router = new Router();

router.all('*', async (ctx, next) => {
    //日志
    // await fs.appendFile(ctx.config.logPath, JSON.stringify({
    //     url: ctx.url,
    //     ip: ctx.ip,
    //     time: Date.now()
    // }) + '\n');

    //黑名单
    let val = await main.getAsync('__block_list_' + ctx.ip);
    if (val) {
        ctx.body = '请求过于频繁，请稍后重试';
        return;
    }


    // let staticServer=ctx.cookies.get('mt');
    // const servers=ctx.config.staticServers;

    //种cookie——uid
    // if(!ctx.cookies.get('uid')){
    //   let uid=uuid().replace(/\-/g, '');
    //   ctx.cookies.set('uid', uid, {
    //     maxAge: 90*86400*1000,
    //     httpOnly: false,
    //     signed: false
    //   });
    // }

    // if(staticServer){
    //   if(servers.indexOf(staticServer)==-1){
    //     staticServer='';
    //   }
    // }

    // if(!staticServer){
    //   staticServer=servers[Math.floor(Math.random()*servers.length)];
    //   ctx.cookies.set('mt', staticServer, {
    //     maxAge: 14*86400*1000
    //   });
    // }

    // ctx.setRenderOption('STATIC', 'http://'+staticServer);
    // ctx.setRenderOption('STATIC', '');
    // ctx.setRenderOption('city', 'bj');
    await next();
});

// const { render } = require('@/react/main');

router.get('/', async ctx => {
    //catalog
    // let catalog = await Catalog.getAll();
    // let { banners, sliders } = await Banner.getAll();

    //
    await ctx.render('index');
});

// router.get('/list', async ctx => {
//     const { kw } = ctx.query;

//     await ctx.render('list', { kw });
// });

// router.get('/shop/:id', async ctx => {
//     const { id } = ctx.params;
//     let detail = await Shop.getDetail(id);

//     await ctx.render('shop', {
//         ...detail,
//     });
// });

// router.get('/cart', async ctx => {
//     await ctx.render('cart', {});
// });


router.all('*', async ctx => {
    await ctx.render('notfound');
});


module.exports = router.routes();
