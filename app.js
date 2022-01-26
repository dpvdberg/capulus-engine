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
// const sessionParser = session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     rolling: true,
//     cookie: {
//         maxAge: Number(process.env.SESSION_EXPIRY)
//     }
// });

//// For cookie-session
const session = require('cookie-session')
const sessionParser = session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        maxAge: Number(process.env.SESSION_EXPIRY)
    });

app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

const {User} = require("./routes/api/auth/userAttacher");
const {models} = require("./database/connectmodels");
passport.serializeUser(User.serializeUser());
passport.deserializeUser(function (username, cb) {
    const query = User.findOne({
        where: {
            email: username.toLowerCase()
        },
        include: {
            model: models.roles,
            attributes: ['name'],
            through: {attributes:[]}
        }
    });
    query.then(function (user) {
        cb(null, user);
    });
    query.catch(function (err) {
        cb(err);
    });
});

// Web sockets
const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://192.168.1.3:3000",
            "http://192.168.1.3.nip.io:3000",
        ]
    }
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionParser));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
    // console.log(socket)
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
});

require('./routes/ws/ws').setup(server, io);
server.listen(process.env.PORT)

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
