const ejs=require('koa-ejs');
const minify=require('html-minifier').minify;
const fs=require('promise-fs');
const path=require('path');

module.exports=async function (app){
  if(!app.config.templateDir)return;
  
  // app.use(body());
  ejs(app, {
    root: app.config.templateDir,
    layout: false,
    viewExt: 'ejs',
    cache:   false,
    debug:   false
  });

  const render=app.context.render;
  app.context.render=async function (name, options={}){
    await render.call(this, name, {
      ...this.__render_options,

      ...options,
    });

    if(app.config.minifyHtml && this.body){
      this.body=minify(this.body, {
        collapseWhitespace: true,
        collapseInlintTagWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,

        minifyCSS: true,
        minifyJS: true,
      });
    }
  };

  //写入静态文件
  app.context.writeCache=async function (name, content){
    let filepath=path.resolve(app.config.cacheDir, name);

    await fs.writeFile(filepath, content);
  };



  app.context.setRenderOption=function (key, val){
    if(!this.__render_options){
      this.__render_options={};
    }

    this.__render_options[key]=val;
  };
  app.context.getRenderOption=function (key){
    if(!this.__render_options)return undefined;

    return this.__render_options[key];
  };
};
