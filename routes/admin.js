var express = require('express');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');
var async = require('async');
var generatePassword = require('password-generator');
var moment = require('moment');

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

router.get('/manageusers', function(req, res, next) {
  if (req.user && req.user.admin) {
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
        loggedIn: true,
        current: req.user,
        admin: true
      });
    });
  } else
    res.location('/staff').redirect('/staff');
});

module.exports = router;