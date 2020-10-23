let router = new require('koa-router')();
const { admin_password, uuid } = require('@/libs/common');
// const Rules=require('@/rules');
const { web } = require('@/mods/__databases');
const Team = require('@/models/admin/team');

router.get('/a', ctx => {
  ctx.body = "asdasda"
})

// /login
/*
username: string
password: string
*/
router.post('/login', async ctx => {
  const { username, password } = ctx.request.fields;

  let rows = await web.query(`SELECT * FROM admin_table WHERE username=?`, [username]);
  if (rows.length == 0) {
    ctx.status = 400;
    ctx.body = { msg: '此用户未注册' };
    return;
  }

  let user = rows[0];
  if (user.password != admin_password(password)) {
    ctx.status = 400;
    ctx.body = { msg: '账户名或密码有误' };
    return;
  }

  let token = uuid();
  let token_expires = Math.floor(Date.now() / 1000 + 14 * 86400);

  await web.query(`UPDATE admin_table SET token=?, token_expires=? WHERE ID=?`, [token, token_expires, user.ID]);

  ctx.body = {
    token, token_expires,
    access: getAccess(['goods_add', 'goods_view', 'goods_del', 'goods_mod'])
  };



  function getAccess(arr) {
    let access = {};

    arr.forEach(name => {
      if (user.parent) {
        access[name] = user[name] ? user[name][0] : 0
      } else {
        access[name] = 1;
      }
    });

    return access;
  }
});



// /reg
/*
username: string
password: string
parent:   int
*/
router.post('/reg', async ctx => {
  const { username, password } = ctx.request.fields;

  try {
    await Team.addUser(username, password, 0);
    ctx.body = { msg: 'ok' };
  } catch (e) {
    ctx.status = 400;
    ctx.body = e;
  }
});









//校验——token是否正确
router.all('*', async (ctx, next) => {
  let token = ctx.get('token');
  if (!token) {
    ctx.status = 400;
    ctx.body = { msg: '请提供token' };
    return;
  }

  let rows = await web.query(`SELECT * FROM admin_table WHERE token=?`, [token]);
  if (rows.length == 0) {
    ctx.status = 400;
    ctx.body = { msg: 'token不存在，请重新登录' };
    return;
  }

  let user = rows[0];
  if (user.token_expires < Date.now() / 1000) {
    ctx.status = 400;
    ctx.body = { msg: 'token已过期，请重新登录' };
    return;
  }

  //
  ctx.admin = user;

  await next();
});







router.get('/logout', async ctx => {
  await web.query(`UPDATE admin_table SET token='',token_expires=0 WHERE ID=?`, [ctx.admin.ID]);

  ctx.body = { msg: 'ok' };
});

router.use('/team', require('./team'));
router.use('/goods', require('./goods'));







module.exports = router.routes();
