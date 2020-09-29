const Router=require('koa-router');
const {main}=require('@/mods/__redis');
const {web}=require('@/mods/__databases');
const request=require('@/libs/request');
const {getUserByMobile, reg, login}=require('@/models/user');

let router=new Router();

const SEARCH_PREFIX='__search_';
const SEARCH_SIZE=10;

const PAGE_SIZE=10;

//跨域
router.all('*', async (ctx,next)=>{
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Method', '*');
  ctx.set('Access-Control-Allow-Headers', '*');

  if(ctx.method=='OPTIONS'){
    ctx.body='ok';
  }else{
    ctx.assert=function (cord, msg){
      if(!cord){
        ctx.status=400;
        ctx.body={msg: 'invaild argument'};

        throw {
          status: 400,
          body: {msg}
        };
      }
    };

    try{
      await next();
    }catch(e){
      if(e.status){
        ctx.status=e.status;
        ctx.body=e.body;
      }else{
        ctx.status=500;
        ctx.body='Internal Server Error';

        console.error(e);
      }
    }
  }
});

router.use('/admin', require('./admin'));
router.use('/user', require('./user'));










router.get('/autocomplete/:kw', async ctx=>{
  const {kw}=ctx.params;
  const key=SEARCH_PREFIX+kw;

  let res=await main.getAsync(key);

  // if(res){
  //   try{
  //     ctx.body=JSON.parse(res);
  //     return;
  //   }catch(e){}
  // }


  //最终结果
  let result=[];
  function mergeResult(arr){
    arr.forEach(item=>{
      if(!result.find(a=>a.title==item.title)){
        result.push(item);
      }
    });
  }

  //从数据库拿
  let searchs=[
    [`SELECT title AS title FROM catalog_item_table WHERE title LIKE ? OR title_pinyin LIKE ? OR title_pinyin LIKE ? LIMIT ?`, [kw+'%', kw+'%', '%,'+kw+'%', SEARCH_SIZE]],
    [`SELECT title AS title FROM sub_catalog_table WHERE title LIKE ? LIMIT ?`, [kw+'%', SEARCH_SIZE]],
    [`SELECT title AS title FROM catalog_table WHERE title LIKE ? LIMIT ?`, [kw+'%', SEARCH_SIZE]],
    [`SELECT shopName AS title FROM meituan.meishi_shop_table WHERE shopName LIKE ? LIMIT ?`, [kw+'%', SEARCH_SIZE]],
    [`SELECT name AS title FROM meituan.meishi_group_table WHERE name LIKE ? LIMIT ?`, [kw+'%', SEARCH_SIZE]]
  ];

  for(let i=0;i<searchs.length;i++){
    let res=await web.query(...searchs[i]);
    mergeResult(res);

    if(result.length>=SEARCH_SIZE){
      result=result.slice(0, SEARCH_SIZE);
      //塞回redis
      // await main.psetexAsync(key, 2*3600*1000, JSON.stringify(result));

      //塞回redis
      ctx.body=result;
      return;
    }
  }

  result=result.slice(0, SEARCH_SIZE);

  // await main.psetexAsync(key, 2*3600*1000, JSON.stringify(result));

  ctx.body=result;
  return;
});

router.get('/search/:kw', async ctx=>{
  let {kw, p='1'}=ctx.params;

  p=Number(p);
  if(isNaN(p))p=1;
  if(p<1)p=1;

  let res=await web.query(`SELECT * FROM meishi_shop_table WHERE shopName LIKE ? LIMIT ?,?`, [`%${kw}%`, (p-1)*PAGE_SIZE, PAGE_SIZE]);
  let rows=await web.query(`SELECT COUNT(*) AS count FROM meishi_shop_table WHERE shopName LIKE ?`, [`%${kw}%`]);



  ctx.body={
    data: res,
    total: Math.ceil(rows[0].count/PAGE_SIZE),
    page: p
  };
});



const SEND_CODE_PREFIX='__send_code_';

// /sendcode?mobile=xxxx
router.get('/sendcode', async ctx=>{
  const {mobile}=ctx.query;

  ctx.assert(mobile, 'invalid argument');
  ctx.assert(/^\d{11}$/.test(mobile), 'invaild argument');


  //手机号是否注册过
  let user=await getUserByMobile(mobile);
  ctx.assert(!user, '此手机号已注册过');

  //校验——IP是否在60s之内发送过
  let res=await main.getAsync(SEND_CODE_PREFIX+ctx.ip);
  ctx.assert(!res, '请求过于频繁，请稍后重试');

  //通过——生成验证码 & 发送出去
  //6位数字:100000~999999
  let code=Math.floor(Math.random()*900000)+100000;

  ctx.session.sms_code=code;
  ctx.session.sms_mobile=mobile;
  ctx.session.sms_expires=Date.now()+300*1000;
  // let res=await request(`https://dysmsapi.aliyuncs.com/?Action=SendSms&msg=${encodeURIComponent(`【美团】您的注册码是${code}，请勿泄露给他人`)}`);
  console.log('code:', code);

  //记录用户倒计时
  await main.psetexAsync(SEND_CODE_PREFIX+ctx.ip, 60*1000, 1);

  ctx.body={msg: 'ok'};
});


//{mobile, code, password}
router.post('/reg', async ctx=>{
  const {mobile, code, password}=ctx.request.fields;

  ctx.assert(mobile==ctx.session.sms_mobile, '手机号有误，请重新填写');
  ctx.assert(code==ctx.session.sms_code, '验证码无效，请重新获取');
  ctx.assert(Date.now()<=ctx.session.sms_expires, '验证码已失效，请重新获取');

  ctx.assert(password, '密码不能为空');
  ctx.assert(/^.{6,}$/.test(password), '密码至少6位');

  ctx.assert((await getUserByMobile(mobile))==undefined, '此手机号已注册过');

  await reg(mobile, password);

  ctx.body={msg: 'ok'};
});




const TOO_MANY_ERROR_PASSWORD_PREFIX='__password_too_many_error_';
const CUR_ERROR_COUNT_PREFIX='__password_error_count_';
const MAX_ERROR_COUNT=5;

//登录——错误超过一定次数，受限   20分钟之内，错误超过5次，等待30分钟
//{mobile, password}
router.post('/login', async ctx=>{
  const {mobile, password}=ctx.request.fields;

  ctx.assert(mobile, '请填写手机号');
  ctx.assert(password, '请填写密码');

  let res=await main.getAsync(TOO_MANY_ERROR_PASSWORD_PREFIX+mobile);
  ctx.assert(!res, '错误次数过多，请稍后重试');

  let errMsg=await login(mobile, password);
  if(errMsg){
    //错误次数+1
    let res=await main.getAsync(CUR_ERROR_COUNT_PREFIX+mobile);
    let errCount=Number(res);

    if(errCount+1===MAX_ERROR_COUNT){
      await main.psetexAsync(TOO_MANY_ERROR_PASSWORD_PREFIX+mobile, 30*60*1000, 1);
    }else{
      await main.psetexAsync(CUR_ERROR_COUNT_PREFIX+mobile, 20*60*1000, errCount+1);
    }

    //返回错误
    ctx.status=400;
    ctx.body={msg: errMsg};
  }else{
    //设置token
    // TODO

    //返回成功
    ctx.body={msg: 'ok'};
  }
});


module.exports=router.routes();
