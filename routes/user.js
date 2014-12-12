var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res) {
	if (req.session.user) {
		res.location("dashboard").redirect("dashboard");
	} else
		res.location("login").redirect("login");
});

router.get('/uploadarticle', function(req, res) {
	if (req.session.user) {
		db = req.db;
		var current;
		User = db.model('User');
		User.find({}, '_id name', {sort: {'name.last':1}}, function(err, users) {
			var userMap = {};
			i = 0;
			users.forEach(function(user) {
				if (user._id == req.session.user)
					current = user;
				userMap[i++] = user;
			});

			res.render('user/upload_article', {
				title: 'Upload Article',
				"userlist": userMap,
				current : current,
				loggedIn: true
			});
		});
	} else
		res.location("login").redirect("login");
});

router.post('/uploadarticle', function(req, res) {
	db = req.db;
	User = db.model('User');
	Article = db.model('Article');
	User.find({ _id: { $in:req.body.author }}, '_id', function(err, users) {
		if (err) return next(err);
		var idArr = [];
		i = 0;
		users.forEach(function(user) {
			idArr[i++] = user._id;
		});
		article = new Article();
		article.authors.push(idArr);
		article.section = req.body.section;
		article.title = req.body.title.trim();
		article.body = req.body.body.trim();
		article.tags = req.body.tags.split(/\s*,\s*/);
		article.save(function(err, article) {
			if (err)
				return next(err);
			res.location("uploadarticle");
			res.redirect("uploadarticle");
		});
	});
});

router.get('/login', function(req, res) {
	if (req.session.user)
		res.location("dashboard").redirect("dashboard");
	else
		res.render('user/login', {
			title: 'Veracity Staff Login'
		});
});

router.post('/login', function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		if (!user)
			return res.redirect('/login');
			req.logIn(user, function(err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	})(req, res, next);
	session = req.session;
	console.log(req.body.userremember);
	db = req.db;
	User = db.model('User');
	User.findOne({email: req.body.useremail}, function(err, user) {
		if (err) return next(err);
		if (user)
			bcrypt.compare(req.body.userpassword, user.password, function(err, pass) {
				if (err) return next(err);  
				if (!pass)
					res.render('user/login', {
						title: 'Veracity Staff Login',
						error: 'Login failed: incorrect password',
						email: req.body.useremail,
						password: req.body.userpassword
					});
				else {
					session.user = user._id;
					if (req.body.userremember)
						session.cookie["expires"] = null;
					console.log(session);
					res.redirect("dashboard");
				}
			});
		else
			res.render('user/login', {
				title: 'Veracity Staff Login',
				error: 'Login failed: email not recognized',
				email: req.body.useremail,
				password: req.body.userpassword
			});
	});
});

router.get('/dashboard', function(req, res) {
	if (req.session.user) {
		db = req.db;
		User = db.model('User');
		User.findById(req.session.user, function(err, user) {
			if (err) return next(err);
			if (user)
				res.render("user/dashboard", {
					title: "Dashboard",
					user: user,
					loggedIn: true,
					admin: user.admin
				});
		});
	} else
		res.location("login").redirect("login");
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

router.post('/updateinfo', function(req, res) {
	db = req.db;
	User = db.model('User');
	now = new Date().toISOString();
	update = {
		name: {first: req.body.firstName, last: req.body.lastName },
		email: req.body.email,
		twitter: req.body.twitter,
		bio: req.body.bio,
		role: req.body.role,
		update_time: now
	};
	if (req.files.img) {
		img = {
			data: req.files.img.buffer,
			contentType: req.files.img.mimetype
		};
		update.img = img;
	}
	User.findByIdAndUpdate(req.session.user, update, function(err) {
		if (err) return next(err);
		else
			res.location('dashboard').redirect('dashboard');
	});
});

router.post('/changepassword', function(req, res) {
	res.end();
	db = req.db;
	User = db.model('User');
	User.findById(req.session.user, function(err, user) {
		if (err) return next(err);
		if (user)
		bcrypt.compare(req.body.current, user.password, function(err, pass) {
			if (err) return next(err);
			if (!pass)
				res.contentType('html').send('Incorrect password');
			else {
				bcrypt.hash(req.body.new, 10, function(err, hash) {
					if (err) return next(err);
					else {
						now = new Date().toISOString();
						user.password = hash;
						user.save(function(err, user) {
							if (err) return next(err);
							else
								res.render("user/dashboard", {
									title: "Dashboard",
									user: user,
									loggedIn: true,
									admin: user.admin
								});
						});
					}
				});
			}
		});
	});
});

module.exports = router;
