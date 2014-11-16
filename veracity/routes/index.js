var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res) {
	res.render('partials/about', { title: 'About Us' })
});

router.get('/contact', function(req, res) {
	res.render('partials/contact', { title: 'Contact Us' })
});

router.get('/campus', function(req, res) {
	res.render('partials/campus', { title: 'Campus' })
});

router.get('/journey', function(req, res) {
	res.render('./partials/journey', { title: 'Journey' })
});

router.get('/lifeandculture', function(req, res) {
	res.render('partials/life_and_culture', { title: 'Life and Culture' })
});

module.exports = router;
