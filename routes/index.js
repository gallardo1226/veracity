var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
	var db = req.db;
	Article = db.model('Article');
	Article.find({status: 'publish'}, '_id section title subtitle authors update_time', { sort: { create_time: 1 } }, function(err, articles) {
		if (err) return next(err);
		var articlelist = [];
		var articleauthors = [];
		var i = 0;
		var length = articles.length;

		articles.forEach(function(article) {
			article.getAuthors().exec(function (err, authors) {
				if (err) return next(err);
				var authorlist = [];
				authors.forEach(function(author) {
					authorlist.push(author.name.full);
				});
				articleauthors[i] = authorlist;
				articlelist[i] = article;
				i++;
				if (i == length) {
					res.render('public/index', {
						title: 'Home',
						'articlelist': articlelist.slice(3),
						'articleauthors': articleauthors.slice(3),
						'carousel': articlelist.slice(0, 3)
					});
				}
			});
		});
	});
});

router.get('/about', function(req, res, next) {
	var db = req.db;
	User = db.model('User');
	User.find({}, '_id name role', {sort: {'name.last':1}}, function(err, users) {
    if (err) return next(err);
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

		res.render('public/about', {
			title: 'About Us',
			'userlist': userMap
		});
	});
});

router.get('/author/:id', function(req, res, next) {
	var db = req.db;
	User = db.model('User');
	User.findById(req.param('id'), '-img', function(err, user) {
		if (err) next(err);

		user.getArticles(false).exec(function (err, articles) {
			if (err) return next(err);

			res.render('public/author', {
				title: user.name.full,
				author: user,
				'articlelist': articles
			});
		});
	});
});

router.get('/contact', function(req, res, next) {
	res.render('public/contact', { title: 'Contact Us' });
});

router.get('/mag/:section', function(req, res, next) {
	var db = req.db;
	Article = db.model('Article');
	var urlsection = req.param('section');
	var section;
	var subsection;
	switch (urlsection) {
		case 'journey':
			section = 'Journey';
			subsection = 'Bloom';
			break;
		case 'campus':
			section = 'Campus';
			subsection = 'Gray Areas';
			break;
		case 'lifeandculture':
			section = 'Life & Culture';
			subsection = 'Vera in the City';
			break;
		default:
			return next();
	}
	Article.find({ section: section, status: 'publish' }, '_id title subtitle authors update_time', { sort: { create_time: 1 }}, function(err, articles) {
		if (err) return next(err);

		var articlelist = [];
		var articleauthors = [];
		var i = 0;

		articles.forEach(function(article) {
			article.getAuthors().exec(function (err, authors) {
				if (err) return next(err);
				var authorlist = [];
				authors.forEach(function(author) {
					authorlist.push(author.name.full);
				});
				articleauthors[i] = authorlist;
				articlelist[i] = article;
				i++;
			});
		});
		Article.findOne({ section: subsection, status: 'publish' }, '_id title subtitle authors update_time body', function(err, sidebar) {
			if (err) next(err);
			sidebar.getAuthors().exec(function (err, authors) {
				if (err) return next(err);
				var authorlist = [];
				authors.forEach(function(author) {
					authorlist.push(author.name.full);
				});
				var sidebarauthors = authorlist;
				res.render('public/section', {
					title: section,
					urlsection: urlsection,
					'articlelist': articlelist.slice(1),
					'articleauthors': articleauthors.slice(1),
					'featured': articlelist[0],
					'featuredauthors': articleauthors[0],
					'sidebar': sidebar,
					'sidebarauthors': sidebarauthors
				});
			});
		});
	});
});

router.get('/mag/:section/:id', function(req, res, next) {
	var db = req.db;
	Article = db.model('Article');
	Article.findById(req.param('id'), function(err, article) {
		article.getAuthors().exec(function (err, authors) {
			if (err) return err;
			var authorlist = [];
			authors.forEach(function(author) {
				authorlist.push(author.name.full);
			});
			res.render('public/article', {
				title: article.title,
				'authorlist': authorlist,
				'article': article,
				img : article.img.contentType
			});
		});
	});
});

module.exports = router;
