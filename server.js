// Setup express
import express from 'express'

import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import logger from 'morgan'

// webpack
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './webpack.config.dev'

// Init app
let app = express();

import routes from './app/routes/index';
import users from './app/routes/users';
import api from './app/routes/api';

const compiler = webpack(webpackConfig)

app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}))
app.use(webpackHotMiddleware(compiler))

// Mongodb credentials
let config = require('./config');

// View Engine
//app.set('view engine', 'jade');
//app.set('view engine', 'hjs');
// app.engine('html', require('ejs').renderFile);
//app.engine('jsx', require('express-react-views').createEngine());
//app.set('views', [__dirname + '/app/views', __dirname + '/app/views/auth', __dirname + '/app/views/projects']);

// BodyParser and Cookie parser Middleware(Setup code)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Points to where our static files going to be on development env
if (app.get('env') === 'development') { 
  app.use(express.static(path.join(__dirname + '/app/public')));
}  

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);

// Set port
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), () => 
  console.log('Server started on port: ' + app.get('port'))
);

// Setup mongoose (Normally diffirent setup ups are on diffirent files)

////////////////////////////////////////////////////// MONGODB - saves data in the database and posts data to the browser

let mongoURI = ( process.env.PORT ) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;
mongoose.connect(mongoURI, function(err, res) {
  if (err) {
    console.log('DB CONNECTION FAILED: '+err)
  } else {
    console.log('DB CONNECTION SUCCESS: '+mongoURI)
  }
});