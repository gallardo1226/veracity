var express = require('express');
var path = require('path');
// var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongo = require('mongodb');
var monk = require('monk');
var secret = require('password-generator');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship');
mongoose.connect('mongodb://localhost:27017/veracity');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connection open");

    var userSchema = mongoose.Schema({
        name: {
            first: String,
            last: String
        },
        img: { data: Buffer, contentType: String },
        email: String,
        password: String,
        admin: Boolean,
        articles: [{type:Schema.ObjectId, ref: "Article"}],
        create_time: { type: Date, default: Date.now },
        update_time: { type: Date, default: Date.now }
    });

    var User = mongoose.model('User', userSchema);

    var articleSchema = mongoose.Schema({
        author: { type:Schema.ObjectId, ref: 'User',  childPath:"articles" },
        img: { data: Buffer, contentType: String }
        section: String,
        title: String,
        body: String,
        tags: [String],
        create_time: { type: Date, default: Date.now },
        update_time: { type: Date, default: Date.now }
    });

    articleSchema.plugin(relationship, { relationshipPathName:"author" });

    var Article = mongoose.model('Article', articleSchema);

    userSchema.methods.getArticles = function() {
        return mongoose.model('Article').find({author_id: this.id});
    };

    userSchema.virtual('name.full').get(function () {
      return this.name.first + ' ' + this.name.last;
    });

    userSchema.virtual('name.full').set(function (name) {
        var split = name.split(' ');
        this.name.first = split[0];
        this.name.last = split[1];
    });
});

var route = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');

var app = express();

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// app.use(session({
//     store: new MongoStore({
//         db: 'veracity',
//         collection: 'sessions',
//     }),
//     resave: false,
//     saveUninitialized: true,
//     secret: secret(20, false),
//     cookie: { secure: true }
// }));

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    req.db = db;
});

app.use('/', route);
app.use('/user', user);
app.use('/admin', admin);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

