var mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  relationship = require('mongoose-relationship'),
	  archiver = require('mongoose-archiver'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy;

// if (process.env.ENV === 'development')
//     uri = 'mongodb://localhost:27017/veracity';
// else
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

    userSchema.methods.getArticles = function(pub) {
        if (typeof pub == 'undefined') pub = true;
        if (pub)
            return mongoose.model('Article').find({ _id: {$in: this.articles }}, '_id title subtitle section update_time status authors');
        return mongoose.model('Article').find({ _id: {$in: this.articles }, status: 'publish'}, '_id title subtitle section update_time status authors');
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
        return mongoose.model('User').find({ _id: {$in: this.authors }}, '_id name img twitter articles');
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

module.exports = {
	passport: passport,
	db: db
};