var express = require('express');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');
var async = require('async');
var moment = require('moment');
var generatePassword = require('password-generator');

router.get('/', function(req, res) {
  res.location('/staff').redirect('/staff');
});

router.post('/adduser', function(req, res, next) {
  db = req.db;
  User = db.model('User');

  var first = req.body.userfirst;
  var last = req.body.userlast;
  var email = req.body.useremail;
  var role = req.body.userrole;
  var password = generatePassword(8, false);
  var newUser = new User({
    name: {first: first, last: last},
    email: email,
    admin: false,
    role: role,
    password: password
  });

  newUser.save(function(err, newUser) {
    if (err) return next(err);
    else {
      res.location("manageusers");
      res.redirect("manageusers");
    }
  });
});

router.post('/removeuser', function(req, res, next) {
  db = req.db;
  User = db.model('User');
  now = new Date().toISOString();
  User.findByIdAndUpdate(req.param('id'), {archive_time: now}, function(err, user) {
    if (err)  return next(err);
    else {
      res.send("User successfully removed");
    }
  });
});

router.post('/resetpassword', function(req, res, next) {
  var name = req.user.name.full;
  var password = generatePassword(8, false);
  async.waterfall([
    function(done) {
      db = req.db;
      User = db.model('User');
      now = new Date().toISOString();
      User.findById(req.param('id'), function(err, user) {
        if (err) return next(err);
        user.password = password;
        user.update_time = now;
        console.log(user.password);
        user.save(function(err, user) {
          if (err) return next(err);
          console.log(user.password);
          done(err, user);
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: 'noahconley2015@u.northwestern.edu',
          pass: 'prayers4rain'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'noahconley2015@u.northwestern.edu',
        subject: 'Your password has been changed',
        html: '<h2>Hello,</h2>' +
        '<p>This is a notice that the password for your account <b>' + user.email + '</b> has just been changed to by administrator ' + name + '.</p>' +
        '<p>Your new temporary password is: <b>' + password + '</b></p>' +
        '<p>It is recommended that you <a href="http://' + req.headers.host + '/staff/login">log in</a> and change your password on your dashboard.</p>'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err);
      });
    }
  ], function(err) {
    res.send('Password reset successfully');
  });
});

router.post('/updatestatus', function(req, res, next) {
  db = req.db;
  User = db.model('User');
  now = new Date().toISOString();
  User.findByIdAndUpdate(req.param('id'), {admin: req.param('status'), update_time: now}, function(err) {
    if (err) return next(err);
    else res.send('Updated successfully');
  });
});

router.post('/updaterole', function(req, res, next) {
  db = req.db;
  User = db.model('User');
  now = new Date().toISOString();
  User.findByIdAndUpdate(req.param('id'), {role: req.param('role'), update_time: now}, function(err) {
    if (err) return next(err);
    else res.send('Updated successfully');
  });
});

router.get('/manageusers', function(req, res, next) {
  if (req.user) {
    db = req.db;
    User = db.model('User');
    User.find({archive_time: null}, '_id name role email admin', {sort: {'name.last':1}}, function(err, users) {
      if (err) return next(err);
      var userMap = {};

      users.forEach(function(user) {
        userMap[user._id] = user;
      });

      res.render('staff/admin/manage_users', {
        title: 'Manage Users',
        "userlist": userMap,
        moment: moment,
        loggedIn: true,
        current: req.user,
        admin: true
      });
    });
  } else
    res.location('/staff').redirect('/staff');
});

module.exports = router;