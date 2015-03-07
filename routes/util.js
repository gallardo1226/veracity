var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var async = require('async');
var fs = require('fs');
var generatePassword = require('password-generator');

router.get('/', function(req, res) {
  res.location('/staff').redirect('/staff');
});

router.post('/removeuser', function(req, res, next) {
  db = req.db;
  User = db.model('User');
  User.findByIdAndRemove(req.param('id'), function(err) {
    if (err)  return next(err);
    else
      res.send("User successfully removed");
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
        host: '192.64.116.221',
        auth: {
          user: 'admin@nuveracity.com',
          pass: ')j1[Bw:jP!7f0'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'admin@nuveracity.com',
        subject: 'Your password has been reset',
        html: '<p><em>Please do not reply to this email</em></p>' +
        '<h2>Hello' + user.name.first + ',</h2>' +
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
  console.log(req.param('id'));
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

router.get('/articleimage/:id', function(req, res) {
  db = req.db;
  Article = db.model('Article');
  Article.findById(req.param('id'), 'img', function(err, article) {
    if (err) return next(err);
    if (article.img.contentType) {
      res.send(article.img.data);
    } else
      res.send(fs.readFileSync('./public/images/blank-article.jpg'));
  });
});

router.post('/updateinfo', function(req, res) {
	now = new Date().toISOString();
	user = req.user;
	user.name = {first: req.body.firstName, last: req.body.lastName };
	user.email = req.body.email;
	user.twitter = req.body.twitter;
	user.bio = req.body.bio;
	user.role = req.body.role;
	user.update_time = now;

	if (req.files.img)
		user.img = {
			data: req.files.img.buffer,
			contentType: req.files.img.mimetype
		};

	user.save(function(err, user) {
		if (err) return next(err);
		else
			res.location('/staff/dashboard').redirect('/staff/dashboard');
	});
});

router.post('/changepassword', function(req, res, next) {
	user = req.user;
	user.comparePassword(req.body.current, function(err, isMatch) {
		if (err)
			res.send(500, 'Current password is incorrect');
		if (isMatch) {
			user.password = req.body.new;
			user.update_time = new Date().toISOString();
			user.save(function(err, user) {
				if (err)
					res.send(500, 'There was a problem changing your password');
				res.send(200, 'Your password was successfully changed');
			});
		} else
			res.send(500, 'There was a problem');
	});
});

router.get('/featuredarticles', function(req, res, next) {
  var db = req.db;
  Article = db.model('Article');
  Article.find({status: 'publish'}, 'title section update_time', { sort: { update_time: 1 }, limit: 3 }, function(err, articles) {
    if (err) next(err);
    res.render('public/_featured', { articles : articles });
  });
});

router.get('/relatedarticles/:id', function(req, res, next) {
  var db = req.db;
  Article = db.model('Article');
  Article.findById(req.param('id'), function(err, article) {
    if (err) next(err);
    Article.find({status: 'publish', tags: { $in: article.tags }, _id: { $ne: article._id }}, 'title section', { limit: 3 }, function(err, articles) {
      if (err) next(err);
      res.render('public/_related', { articles : articles });
    });
  });
});

module.exports = router;