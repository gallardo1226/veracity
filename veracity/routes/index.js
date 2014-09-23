var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res) {
	res.render('about', { title: 'About Us' })
});

router.get('/contact', function(req, res) {
	res.render('contact', { title: 'Contact Us' })
});

router.get('/campuslife', function(req, res) {
	res.render('campus_life', { title: 'Campus Life' })
});

router.get('/journey', function(req, res) {
	res.render('journey', { title: 'Journey' })
});

router.get('/lifeandculture', function(req, res) {
	res.render('life_and_culture', { title: 'Life and Culture' })
});

router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

module.exports = router;
