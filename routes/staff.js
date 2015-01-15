var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
var fs = require('fs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var async = require('async');

router.get('/', function(req, res) {
	if (req.user)
		res.location("/staff/dashboard").redirect("/staff/dashboard");
	else
		res.location("/staff/login").redirect("/staff/login");
});

router.get('/login', function(req, res) {
	if (req.user)
		res.location("dashboard").redirect("dashboard");
	else
		res.render('staff/login', {
			title: 'Veracity Staff Login'
		});
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: 'dashboard',
		failureRedirect: 'login',
		failureFlash: true
	})
);

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/staff');
});

router.get('/uploadarticle', function(req, res, next) {
	if (req.user) {
		user = req.user;
		db = req.db;
		var current;
		User = db.model('User');
		User.find({}, '_id name', {sort: {'name.last':1}}, function(err, users) {
			if (err) return next(err);
			var userMap = {};
			i = 0;
			users.forEach(function(u) {
				if (u._id.toString() != user._id.toString())
					userMap[i++] = u;
			});

			res.render('staff/article_form', {
				title: 'Upload Article',
				"userlist": userMap,
				current : user,
				loggedIn: true,
				admin: req.user.admin,
				article: {}
			});
		});
	} else
		res.location("/staff").redirect("/staff");
});

router.get('/editarticle/:id', function(req, res, next) {
	if (req.user) {
		user = req.user;
		db = req.db;
		var current;
		User = db.model('User');
		Article = db.model('Article');
		User.find({}, '_id name', {sort: {'name.last':1}}, function(err, users) {
			if (err) return next(err);
			var userMap = {};
			i = 0;
			users.forEach(function(u) {
				if (u._id.toString() != user._id.toString())
					userMap[i++] = u;
			});

			Article.findById(req.param('id'), '-create_time -update_time', function(err, article) {
				if (err) return next(err);
				res.render('staff/article_form', {
					title: 'Edit Article',
					"userlist": userMap,
					current : user,
					loggedIn: true,
					admin: req.user.admin,
					article: article
				});
			});
		});
	} else
		res.location("/staff").redirect("/staff");
});

router.post('/submitarticle', function(req, res, next) {
	db = req.db;
	User = db.model('User');
	Article = db.model('Article');
	var authors = [];
	if (req.body.author.constructor === String)
		authors.push(req.body.author);
	else
		authors = [];
	User.find({ _id: { $in: authors }}, '_id', function(err, users) {
		if (err) return next(err);
		i = 0;
		if (req.body.edit) {
			Article.findById(req.body.edit, function(err, article) {
				if (err) return next(err);
				users.forEach(function(user) {
					article.authors.push(user._id);
				});
				article.section = req.body.section;
				article.title = req.body.title.trim();
				article.subtitle = req.body.subtitle.trim();
				article.body = req.body.body.trim();
				article.tags = req.body.tags.split(/\s*,\s*/);
				var response;
				if (req.body.publish) {
					article.status = req.body.publish;
					response = 'Article published';
				} else {
					article.status = req.body.draft;
					response = 'Article saved';
				}

				if (req.files.img)
					article.img = {
						data: req.files.img.buffer,
						contentType: req.files.img.mimetype
					};

				article.update_time = new Date().toISOString();

				article.save(function(err, article) {
					if (err) return next(err);
					req.flash('success', response);
					res.location("myarticles").redirect("myarticles");
				});
			});
		} else {
			article = new Article();
			users.forEach(function(user) {
				article.authors.push(user._id);
			});
			article.section = req.body.section;
			article.title = req.body.title.trim();
			article.subtitle = req.body.subtitle.trim();
			article.body = req.body.body.trim();
			article.tags = req.body.tags.split(/\s*,\s*/);
			var response;
			if (req.body.publish) {
				article.status = req.body.publish;
				response = 'Article uploaded and published';
			} else {
				article.status = req.body.draft;
				response = 'Article uploaded and saved';
			}

			if (req.files.img)
				article.img = {
					data: req.files.img.buffer,
					contentType: req.files.img.mimetype
				};
			article.save(function(err, article) {
				if (err) return next(err);
				req.flash('success', response);
				res.location("myarticles").redirect("myarticles");
			});
		}
	});
});

router.post('/deletearticle', function(req, res, next) {
  db = req.db;
  Article = db.model('Article');
  Article.findByIdAndRemove(req.param('id'), function(err) {
    if (err)  return next(err);
    else
      res.send("Article successfully deleted");
  });
});

router.get('/dashboard', function(req, res, next) {
	if (req.user) {
		console.log(req.user.name.full + 'is logged in');
		res.render("staff/dashboard", {
			title: "Dashboard",
			user: req.user,
			loggedIn: true,
			admin: req.user.admin
		});
	} else
		res.location("/staff").redirect("/staff");
});

router.get('/myarticles', function(req, res) {
	if (req.user) {
		req.user.getArticles().exec(function (err, articles) {
			if (err) return err;

			res.render("staff/my_articles", {
				title: "My Articles",
				user: req.user,
				loggedIn: true,
				admin: req.user.admin,
				'articlelist': articles
			});
		});
	} else
		res.location("/staff").redirect("/staff");
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
			res.location('dashboard').redirect('dashboard');
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

router.get('/forgot', function(req, res) {
	res.render('staff/forgot', {
		title: 'Request password reset',
		user: req.user
	});
});

router.post('/forgot', function(req, res, next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			db = req.db;
			User = db.model('User');
			User.findOne({ email: req.body.email }, function(err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('forgot');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		function(token, user, done) {
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
				subject: 'Veracity staff password reset',
				html: '<p><em>Please do not reply to this email</em></p>' +
        '<h2>Hello ' + user.name.first + ',</h2>'+
				'<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>' +
				'<p>Please click <a href="http://' + req.headers.host + '/staff/reset/' + token + '">here</a> to complete the process.</p>' +
				'<p>If you did <b>not</b> request this, please ignore this email and your password will remain unchanged.</p>'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
		res.location('forgot').redirect('forgot');
	});
});

router.get('/reset/:token', function(req, res) {
	db = req.db;
	User = db.model('User');
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.location('forgot').redirect('forgot');
		}
		res.render('staff/reset', {
			user: req.user,
			title: 'Reset password'
		});
	});
});

router.post('/reset/:token', function(req, res) {
	async.waterfall([
		function(done) {
			db = req.db;
			User = db.model('User');
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('/staff');
				}

				user.password = req.body.password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;

				user.save(function(err, user) {
					req.logIn(user, function(err) {
						done(err, user);
					});
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
				subject: 'Your password has been changed',
				html: '<p><em>Please do not reply to this email</em></p>' +
					'<h2>Hello' + user.name.first + ',</h2>'+
					'<p>This is a confirmation that the password for your account <b>' + user.email + '</b> has just been changed.</p>'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
	], function(err) {
		res.redirect('/staff');
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

module.exports = router;