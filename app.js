require('dotenv').config();
require('./utils/extensions')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const flash = require('connect-flash');
const logger = require('morgan');

const apiRouter = require('./routes/api/api');
const passport = require("passport");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(function(req,res,next){setTimeout(next,1000)});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(flash());

app.use(cookieParser());

//// For express-session
// const session = require('express-session');
// app.use(session({
//         secret: process.env.COOKIE_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         rolling: true,
//         cookie: {
//             maxAge: Number(process.env.SESSION_EXPIRY)
//         }
//     })
// );

//// For cookie-session
const session = require('cookie-session')
app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        maxAge: Number(process.env.SESSION_EXPIRY)
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

// Web sockets
const wsRouter = require('./routes/ws/ws').wsRouter(app);
app.use('/ws', wsRouter);
app.listen(9001);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
