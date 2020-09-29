const https=require('https');
const http=require('http');


module.exports=function (url){
  let mod=null;
  if(url.startsWith('http://'))mod=http;
  else mod=https;

  return new Promise((resolve, reject)=>{
    let req=mod.request(url, res=>{
      let arr=[];
      res.on('data', buffer=>{
        arr.push(buffer);
      });
      res.on('end', ()=>{
        resolve(Buffer.concat(arr).toString());
      });
    });



    req.on('error', err=>{
      reject(err);
    });

    req.write('');
    req.end();
  });
}
