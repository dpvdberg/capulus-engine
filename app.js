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
const {setupSentry, setupSentryErrorHandlers} = require("./sentry-init");

const app = express();
setupSentry(app);

console.log('Initializing database...')
require("./db-init")
console.log("Starting app...")

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : process.env.DOMAIN);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
//     domain: process.env.DOMAIN,
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
    domain: process.env.NODE_ENV === 'development' ? '' : process.env.DOMAINprocess.env.DOMAIN,
    maxAge: Number(process.env.SESSION_EXPIRY)
});

app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

const {user} = require("./routes/api/auth/userAttacher");
const models = require("./database/models");

class SerializationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name
    }
}

passport.serializeUser((u, done) => {
    if (u.get('provider') === 'guest') {
        done(null, { idtype: 'provider_uid', id: u.get('provider_uid') });
    } else {
        done(null, { idtype: 'email', id: u.get('email') });
    }
})

passport.deserializeUser(function (obj, cb) {
    if (typeof obj !== 'object' || !('idtype' in obj) || !('id' in obj)) {
        console.error("Serialized object malformed")
        // serialized object malformed
        cb(new SerializationError('malformed object'), false);
        return;
    }

    let whereObject = {};
    whereObject[obj.idtype] = obj.id;

    user.findOne({
        where: whereObject,
        include: {
            model: models.role,
            through: {attributes: []}
        }
    }).then((u) => {
        cb(null, u);
    }).catch((err) => {
        console.error("Deserializing user failed")
        cb(new SerializationError('deserializing user failed'), null);
    });
});

// Web sockets
const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionParser));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

require('./routes/ws/ws').setup(server, io);
server.listen(process.env.PORT)

// Setup sentry error handlers before any other error handler
setupSentryErrorHandlers(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(req);
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    if (err instanceof SerializationError) {
        console.warn("Logging out user after user serialization error")
        req.logout();
    }

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
