var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');//i added
const mongoose = require('mongoose');//i added
const session = require('express-session');//i added
const passport = require('passport'); // i added
const validator =  require('express-validator'); //i added
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session); //i added


var index = require('./routes/index');
var aframe = require('./routes/aframe');
var userRoute = require('./routes/user');


var app = express();

//connet the mongodb
//create a folder models
mongoose.connect('localhost:27017/shooping')
require('./config/passport');

// view engine setup. I added it
//create a new folder call layout
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: 'hbs'}));// I added it
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());//i added
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000}
}));//i added
app.use(flash());//i added
app.use(passport.initialize());//i added
app.use(passport.session());//i added
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/aframe', aframe);
app.use('/user', userRoute);
app.use('/', index);
// app.get('/aa', (req,res) => {
//     res.render('shop/aframe.hbs');
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
