var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var users = require('./routes/users');
var login = require('./routes/loginRoute');
var register = require('./routes/registerRoute');
var config = require('./routes/configRoute');
var forms = require('./routes/formsRoute');

var db = require('./db/dbmanager');
db.connect();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
		resave: false,
		rolling: false,
		saveUninitialized: true,
    secret : "test and test",
		name: 'xsession',
		cookie: { maxAge: 60 * 1000}
	}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
   console.log("session" + req.session.username);
    if (!req.session.username) {
     if (req.url === '/' || req.url === '/login' || req.url === '/register') {
       next();/*请求为登陆或者注册则不需要校验session*/
     }
     else{
       res.redirect("/");
     }
   }
   else if (req.session.username) {
     next();
   }
});
app.use('/', login);
// app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/config',config);
app.use('/forms',forms);

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
