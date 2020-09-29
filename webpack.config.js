const path=require('path');
const config=require('./config');

function gen(target, libraryTarget, outPath){
  return {
    mode: 'development',
    entry: config.reactEntries,
    target,
    devtool: 'source-map',
    output: {
      libraryTarget,
      path: outPath,
      filename: '[name].js',
    },
    module: {
      rules: [
        {test: /\.jsx$/, exclude: /node_modules/, use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }}
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'react_src')
      }
    }
  }
}

module.exports=[
  gen('node', 'umd', path.resolve(__dirname, 'react_dist')),
  gen(undefined, undefined, path.resolve(__dirname, 'static')),
];
