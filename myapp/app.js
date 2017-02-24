const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// const users = require('./routes/users');
const login = require('./routes/loginRoute');
const register = require('./routes/registerRoute');
const config = require('./routes/configRoute');
const forms = require('./routes/formsRoute');
const db = require('./db/dbmanager');

db.connect();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
    resave: false,
    rolling: false,
    saveUninitialized: true,
    secret: 'test and test',
    name: 'xsession',
    cookie: { maxAge: 60 * 60 * 1000 },
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`session : ${req.session.username}`);
    if (!req.session.username) {
        if (req.url === '/' || req.url === '/login' || req.url === '/register') {
            next(); /* 请求为登陆或者注册则不需要校验session */
        } else {
            res.redirect('/');
        }
    } else if (req.session.username) {
        next();
    }
});
app.use('/', login);
// app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/config', config);
app.use('/forms', forms);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
    const response = res;
    response.locals.message = err.message;
    response.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    response.status(err.status || 500);
    response.render('error');
});


module.exports = app;
