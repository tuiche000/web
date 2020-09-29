const fs=require('fs');

let json={};

fs.readFileSync('./pinyin.txt').toString().split(/\r\n|\n|\r/).map(str=>{
  let char=str[0];
  /（([a-z0-9\s]+)）/.test(str);

  let r={};
  RegExp.$1.split(' ').map(s=>s.replace(/\d$/, '')).forEach(s=>r[s]=true);
  let pinyins=[];
  for(let key in r)pinyins.push(key);

  json[char]=pinyins;
});

function word2pinyin(str){
  if(!str)return [''];

  let result=[];

  if(json[str[0]]){
    json[str[0]].forEach(char=>{
      word2pinyin(str.substring(1)).forEach(char2=>{
        result.push(char+char2);
        // result.push(char[0]+char2);
      });
    });
  }else{
    word2pinyin(str.substring(1)).forEach(char2=>{
      result.push(str[0]+char2);
      // result.push(str[0][0]+char2);
    })
  }

  let r={};
  result.forEach(s=>r[s]=1);

  result=[];
  for(let key in r)result.push(key);

  return result;
}

module.exports=word2pinyin;
