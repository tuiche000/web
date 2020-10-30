const path=require('path');
const mode=process._argv ? (process._argv.env=='dev'?'dev':'prod') : "dev"
// const mode='dev';

module.exports={
  apps: {
    web: {
      version: 4,
      enabled: true,
      entry: path.resolve(__dirname, 'apps/web'),
      templateDir: path.resolve(__dirname, 'apps/web/template'),
      cacheDir: mode=='dev'?__dirname:'/usr/share/nginx/html/',
      logPath: path.resolve(__dirname, './logs/access.log'),
      port: 8080,
      minifyHtml: true,
    },
    s: {
      version: 5,
      enabled: true,
      entry: path.resolve(__dirname, 'apps/s'),
      port: 8081,
      minifyHtml: false,
    },
    api: {
      version: 1,
      enabled: true,
      entry: path.resolve(__dirname, 'apps/api'),
      port: 8082,
      minifyHtml: false,
    },
    blog: {
      version: 6,
      enabled: true,
      entry: path.resolve(__dirname, 'apps/blog'),
      templateDir: path.resolve(__dirname, 'apps/blog/template'),
      cacheDir: mode=='dev'?__dirname:'/usr/share/nginx/html/',
      logPath: path.resolve(__dirname, './logs/access.log'),
      port: 8083,
      minifyHtml: true,
    }
  },

  databases: {
    web: {
      host: '49.234.34.170',
      port: 3306,
      user: 'root',
      password: mode=='dev'?'':'',
      database: 'meituan',
    },
    blog: {
      host: '49.234.34.170',
      port: 3306,
      user: 'root',
      password: '',
      database: 'blog',
    },
  },

  redis: {
    main: {
      host: 'localhost',
      port: 6379,
      password: undefined,
    }
  },

  reactEntries: {
    main: path.resolve(__dirname, './react_src/index')
  },

  staticServers: [
    's0.mt.com',
    's1.mt.com',
    's2.mt.com',
  ]
};
