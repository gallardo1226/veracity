var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var flash = require('express-flash');
var mongo = require('mongodb');
var session = require('express-session');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship'),
    archiver = require('mongoose-archiver');

if (process.env.ENV === 'development')
    uri = 'mongodb://localhost:27017/veracity';
else
    uri = 'mongodb://heroku_app32220259:6livjuh743c00eertbsg1tpi03@ds061360.mongolab.com:61360/heroku_app32220259';
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connection open on port " + db.port);

    var userSchema = mongoose.Schema({
        name: { last: String, first: String },
        img: { data: Buffer, contentType: String },
        role: String,
        email: { type: String, required: true, unique: true },
        twitter: String,
        password: String,
        admin: Boolean,
        bio: String,
        articles: [{ type: Schema.ObjectId, ref: "Article" }],
        create_time: { type: Date, default: Date.now },
        update_time: { type: Date, default: Date.now },
        resetPasswordToken: String,
        resetPasswordExpires: Date
    });

    userSchema.plugin(archiver);

    userSchema.methods.getArticles = function() {
        return mongoose.model('Article').find({ _id: {$in: this.articles }}, '_id title subtitle section update_time status');
    };

    userSchema.virtual('name.full').get(function() {
      return this.name.first + ' ' + this.name.last;
    });

    userSchema.pre('save', function(next) {
        var user = this;
        if (!user.isModified('password')) return next();
        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });

    userSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    userSchema.virtual('name.full').set(function (name) {
        var split = name.split(' ');
        this.name.first = split[0];
        this.name.last = split[1];
    });

    var User = mongoose.model('User', userSchema);

    var articleSchema = mongoose.Schema({
        authors: [{ type: Schema.ObjectId, ref: 'User',  childPath: "articles" }],
        section: String,
        status: String,
        title: String,
        subtitle: String,
        body: String,
        tags: [String],
        img: { data: Buffer, contentType: String },
        create_time: { type: Date, default: Date.now },
        update_time: { type: Date, default: Date.now }
    });

    articleSchema.plugin(relationship, { relationshipPathName:"authors" });
    articleSchema.plugin(archiver);

    articleSchema.methods.getAuthors = function() {
        return mongoose.model('User').find({ _id: {$in: this.authors }}, '_id name img twitter');
    };

    var Article = mongoose.model('Article', articleSchema);

    passport.use(new LocalStrategy(function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) return done(err);
                if (!user) return done(null, false, { message: 'Incorrect username.' });
                user.comparePassword(password, function(err, isMatch) {
                    if (isMatch)
                        return done(null, user);
                    else
                        return done(null, false, { message: 'Incorrect password.' });
            });
        });
    }));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
});

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

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'does rocks float on lava',
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    req.db = db;
    req.passport = passport;
    next();
});

app.use(function(req,res,next) {
    res.locals.session = req.session;
    next();
});

var route = require('./routes/index');
var staff = require('./routes/staff');
var admin = require('./routes/admin');

app.use('/', route);
app.use('/staff', staff);
app.use('/admin', admin);

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