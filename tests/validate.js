const Validate=require('async-validate');

Validate.plugin([
  require('async-validate/plugin/object'),
  require('async-validate/plugin/string'),
  require('async-validate/plugin/util')
]);

let rules={
  type: 'object',
  fields: {
    username: {
      min: 4, message: '用户名最少4个字'
    }
  }
}
//   {required: true, message: '用户名必须填写'},
//   {min: 4, message: '用户名最少4个字'},
//   {max: 32, message: '用户名最长32个字'},
//   {type: 'regexp', pattern: /^\w{4,32}$/, message: '用户名必须仅包含数字字母、下划线'}
// ];

let validate=new Validate(rules);

validate.validate({
  username: 'blu'
}, (err, res)=>{
  console.log(err, res);
});
