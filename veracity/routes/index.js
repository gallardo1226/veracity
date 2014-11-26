var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    // console.log("global load");
    res.render('index', { title: 'About Us' });
    // var previous      = req.session.value || 0;
    // req.session.value = previous + 1;
    // res.end('<h1>Previous value: ' + previous + '</h1>');
    // res.send(req.session);
});

router.get("/request",function(req,res){
    console.log("request received");
    console.log(req.session);
    var m=req.session.isLogged || 0;
    req.session.isLogged = m+1;
    console.log(req.session.isLogged);
});

router.get("/getsession",function(req,res){
    console.log("getsession received");
    console.log(req.session);
    console.log(req.session.isLogged);
})

router.get('/about', function(req, res) {
	res.render('public/about', { title: 'About Us' });
});

router.get('/contact', function(req, res) {
	res.render('public/contact', { title: 'Contact Us' });
});

router.get('/campuslife', function(req, res) {
	res.render('public/campus_life', { title: 'Campus Life' });
});

router.get('/journey', function(req, res) {
	res.render('public/journey', { title: 'Journey' });
});

router.get('/lifeandculture', function(req, res) {
	res.render('public/life_and_culture', { title: 'Life and Culture' });
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
