var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var flash = require('express-flash');
var mongo = require('mongodb');
var session = require('express-session');
var dbsetup = require('./dbsetup');
var seojs = require('express-seojs');

if (process.env.ENV === 'production')
    var grunt = require('./gruntfile');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(flash());
app.use(multer({ inMemory: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(seojs('does rocks float on lava'));

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'does rocks float on lava',
}));

app.use(dbsetup.passport.initialize());
app.use(dbsetup.passport.session());

app.use(function(req,res,next){
    req.db = dbsetup.db;
    req.passport = dbsetup.passport;
    next();
});

app.use(function(req,res,next) {
    res.locals.session = req.session;
    next();
});

var route = require('./routes/index');
app.use('/', route);
var staff = require('./routes/staff');
app.use('/staff', staff);
var admin = require('./routes/admin');
app.use('/admin', admin);
var util = require('./routes/util');
app.use('/util', util);

var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port %d', server.address().port);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (process.env.ENV === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('public/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('public/error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;