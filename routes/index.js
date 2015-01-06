var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
		res.render('public/index', { title: 'Home' });
});

router.get('/about', function(req, res, next) {
	res.render('public/about', { title: 'About Us' });
});

router.get('/contact', function(req, res, next) {
	res.render('public/contact', { title: 'Contact Us' });
});

router.get('/:section', function(req, res) {
	var db = req.db;
	Article = db.model('Article');
	var section = req.param('section');
	Article.find({ section: section }, '_id title subtitle', { sort: { create_time: 1 }}, function(err, articles) {
		if (err) return next(err);

		var articlelist = [];
		var i = 0;

		articles.forEach(function(article) {
			article.getAuthors().exec(function (err, authors) {
				if (err) return next(err);
				article.authors = authors;
				if (i === 0)
					featured = article;
				else
					articlelist[i] = article;
				i++;
			});
		});
		var subsection;
		switch (section) {
			case 'Journey':
				subsection = 'Bloom';
				break;
			case 'Campus':
				subsection = 'Gray Area';
				break;
			case 'Life & Culture':
				subsection = 'Vera in the City';
				break;
			default:
				break;
		}

		Article.findOne({ section: subsection }, '_id title subtitle', function(err, sidebar) {
			sidebar.getAuthors().exec(function (err, authors) {
				if (err) return next(err);
				sidebar.authors = authors;
			});

			res.render('public/section', {
				title: section,
				'articlelist': articlelist,
				'featured': featured,
				'sidebar': sidebar
			});
		});
	});
});

router.get('/:section/:id', function(req, res, next) {
	var db = req.db;
	Article = db.model('Article');
	Article.findById(req.param('id'), function(err, article) {
		var authorlist;
		article.getAuthors().exec(function (err, authors) {
			if (err) return err;
			authorlist = authors;
		});

		res.render('public/article', {
			title: article.title,
			'authorlist': authorlist,
			'article': article
		});
	});
});

router.get('/image/:id', function(req, res) {
	db = req.db;
	Article = db.model('Article');
	Article.findById(req.param('id'), 'img', function(err, article) {
		if (err) return next(err);
		if (user.img.contentType) {
			res.send(user.img.data);
		} else
			res.send(fs.readFileSync('./public/images/logo.png'));
	});
});

module.exports = router;
