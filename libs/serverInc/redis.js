const redis=require('redis');
const bluebird=require('bluebird');
const __redis=require('@/mods/__redis');

const config=require('@/config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports=async function (){
  for(let name in config.redis){
    let client=redis.createClient(config.redis[name]);

    // await client.setAsync('__$$name$', 99);
    // if(99!=await client.getAsync('__$$name$')){
    //   throw 'redis init faild';
    // }
    // await client.delAsync('__$$name$');

    __redis[name]=client;
  }
};
