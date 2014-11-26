var express = require('express');
var router = express.Router();
var app = require('../app');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var generatePassword = require('password-generator');
var path = require('path')
  , templatesDir = path.join(__dirname, 'templates')
  , emailTemplates = require('email-templates');

router.get('/', function(req, res) {
  res.render('admin/index', { title: 'Admin Home' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    db = req.db;
    User = db.model('User');

    // Get our form values. These rely on the "name" attributes
    var userFirst = req.body.userfirst;
    var userLast = req.body.userlast;
    var userEmail = req.body.useremail;
    var password = generatePassword(8, false);
    bcrypt.hash(password, 10, function(err, hash) {
        if (err)
            res.send(404,{error: "bcrypt: error hashing password."});

        var newUser = new User({
            name: {first: userFirst, last: userLast},
            email: userEmail,
            admin: false,
            password: hash
        });

        newUser.save(function(err, newUser) {
            if (err)
                res.send(500, "There was a problem adding the information to the database.");    
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("manageusers");
                // And forward to success page
                res.redirect("manageusers");
            }
        });
    });
});

router.post('/removeuser', function(req, res) {
    db = req.db;
    User = db.model('User');
    var user = User.remove({_id: req.param('id')}, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "There was a problem removing the user from the database.");    
        }
        else {
            res.send("User successfully removed");
        }
    });
});

router.post('/resetpassword', function(req, res) {
    db = req.db;
    User = db.model('User');
    var password = generatePassword(8, false);
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            res.send(404,{error: "bcrypt: error getting salt."});
        bcrypt.hash(password, salt, function(err, hash) {
            if (err)
                res.send(404,{error: "bcrypt: error hashing password."});
            User.update({_id: req.param('id')}, {password: hash}, function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, "There was a problem updating resetting the user's password.");
                } else {
                    res.send('Password reset successfully');
                }
            });
        });
    });
})

router.post('/updatestatus', function(req, res) {
    db = req.db;
    User = db.model('User');
    User.update({_id: req.param('id')}, {admin: req.param('status')}, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "There was a problem updating the user in the database.");
        } else {
            res.send('Updated successfully');
        }
    });
});

router.get('/manageusers', function(req, res) {
    req.session.lastPage = '/manageusers';
    db = req.db;
    User = db.model('User');
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
          userMap[user._id] = user;
      });

        res.render('admin/manage_users', { 
          title: 'Manage Users',
          "userlist": userMap,
          moment: moment 
      });
    });
});

module.exports = router;