var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
var bcrypt = require('bcrypt');
var generatePassword = require('password-generator');

router.get('/', function(req, res) {
  res.render('admin/index', { title: 'Admin Home' });
});

router.post('/adduser', function(req, res) {
    db = req.db;
    User = db.model('User');

    var userFirst = req.body.userfirst;
    var userLast = req.body.userlast;
    var userEmail = req.body.useremail;
    var userRole = req.body.userrole;
    var password = generatePassword(8, false);
    bcrypt.hash(password, 10, function(err, hash) {
        if (err)
            res.send(404,{error: "bcrypt: error hashing password."});
        else {
            var newUser = new User({
                name: {first: userFirst, last: userLast},
                email: userEmail,
                admin: false,
                role: userRole,
                password: hash
            });

            newUser.save(function(err, newUser) {
                if (err)
                    res.send(500, "There was a problem adding the information to the database.");
                else {
                    res.location("manageusers");
                    res.redirect("manageusers");
                }
            });
        }
    });
});

router.get('/image/:id', function(req, res) {
    db = req.db;
    User = db.model('User');
    User.findById(req.param('id'), 'img', function(err, user) {
        if (err) return next(err);
        if (user.img.contentType) {
            res.send(user.img.data);
        } else
            res.send(fs.readFileSync('./public/images/blank-profile.png'));
    });
});

router.post('/removeuser', function(req, res) {
    db = req.db;
    User = db.model('User');
    User.findByIdAndRemove(req.param('id'), function(err) {
        if (err) {
            console.log(err);
            res.send(500, "There was a problem removing the user from the database.");
        } else {
            res.send("User successfully removed");
        }
    });
});

router.post('/resetpassword', function(req, res) {
    db = req.db;
    User = db.model('User');
    now = new Date().toISOString();
    var password = generatePassword(8, false);
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            console.log(err.message);
            res.send(500,"bcrypt: error hashing password.");
        } else {
            User.findByIdAndUpdate(req.param('id'), {password: hash, update_time: now}, function(err) {
                if (err) {
                    console.log(err.message);
                    res.send("There was a problem resetting the user's password.");
                } else {
                    res.send('Password reset successfully');
                }
            });
        }
    });
});

router.post('/updatestatus', function(req, res) {
    db = req.db;
    User = db.model('User');
    now = new Date().toISOString();
    User.findByIdAndUpdate(req.param('id'), {admin: req.param('status'), update_time: now}, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "There was a problem updating the user in the database.");
        } else {
            res.send('Updated successfully');
        }
    });
});

router.post('/updaterole', function(req, res) {
    db = req.db;
    User = db.model('User');
    now = new Date().toISOString();
    User.findByIdAndUpdate(req.param('id'), {role: req.param('role'), update_time: now}, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "There was a problem updating the user in the database.");
        } else {
            res.send('Updated successfully');
        }
    });
});

router.get('/manageusers', function(req, res) {
    db = req.db;
    User = db.model('User');
    User.find({}, '-img', {sort: {'name.last':1}}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            userMap[user._id] = user;
        });

        res.render('user/admin/manage_users', {
            title: 'Manage Users',
            "userlist": userMap,
            moment: moment,
      });
    });
});

module.exports = router;