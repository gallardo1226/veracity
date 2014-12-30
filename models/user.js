var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require('mongoose-relationship');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    name: { last: String, first: String },
    img: { data: Buffer, contentType: String },
    role: String,
    email: String,
    twitter: String,
    password: String,
    admin: Boolean,
    bio: String,
    articles: [{type:Schema.ObjectId, ref: "Article"}],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now }
});

userSchema.methods.getArticles = function() {
    return mongoose.model('Article').find({author_id: this.id});
};

userSchema.virtual('name.full').get(function () {
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
        console.log(candidatePassword);
        console.log(isMatch);
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.virtual('name.full').set(function (name) {
    var split = name.split(' ');
    this.name.first = split[0];
    this.name.last = split[1];
});

module.exports = mongoose.model('User', userSchema);