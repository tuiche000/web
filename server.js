require('module-alias/register');

const minimist = require('minimist');
const argv = minimist(process.argv);
process._argv = argv;

const path = require('path');
const fs = require('fs');

let config = require('./config');
const cluster = require('cluster');
const server = require('./libs/server');

function myRequire(name) {
  let str = fs.readFileSync(name).toString();

  let module = {};
  eval(str);      //危险
  return module.exports;
}




if (cluster.isMaster) {         //主进程——仅负责创建子进程
  setInterval(() => {
    let newConfig = myRequire(path.resolve(__dirname, './config.js'));

    for (let name in newConfig.apps) {
      let newApp = newConfig.apps[name];
      let oldApp = config.apps[name];

      if (newApp.version != oldApp.version) {
        //启动一个新的进程
        newApp.name = name;
        newApp.worker = createWoker(newApp);

        //通知老的，close
        oldApp.worker.send('close new connection');
      } else {
        newApp.worker = oldApp.worker;
      }
    }

    config = newConfig;
  }, 1000);

  function createWoker(app) {
    if (!app.enabled) return;

    // worker == child process
    let worker = cluster.fork();

    worker.on('exit', code => {
      console.log('子进程退出了', code);
      if (code) {
        //重启子进程
        setTimeout(function () {
          createWoker(app);
        }, 1000);
      }
    });

    console.log('新的子进程:', app.name, app.version);

    worker.send(app);

    return worker;
  }

  console.log('主进程启动了');
  for (let key in config.apps) {
    const app = { ...config.apps[key], ...config };
    app.name = key;
    
    let worker = createWoker(app);
    app.worker = worker;
    config.apps[key].worker = worker;
  }
} else {                        //子进程——承担服务工作
  let httpd;

  process.on('message', async config => {
    if (config === 'close new connection') {
      httpd.close(() => {
        console.log('老进程退出了');
        process.exit(0);
      });
    } else {
      httpd = await server(config);
    }
  });
}
