const path = require('path');
const clout = require('clout-js');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const distDir = webpackConfig.output.path

function WebpackHook(next: Function) {
   this.app.get('/', (req: any, res: any) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
   });
   this.app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath, stats:    { colors: true }
   }));
   this.app.use(require('webpack-hot-middleware')(compiler));
   this.app.use(express.static(distDir));
   next();
}
WebpackHook._name = 'WebpackHook';
WebpackHook.group = 'Webpack';

clout.registerHook('start', WebpackHook, 21);
clout.start();
clout.on('started', () => {
   const httpInfo = clout.server.http;
   const serverInfo = httpInfo.address().port;
   console.log(`server started at ${serverInfo}`)
});
